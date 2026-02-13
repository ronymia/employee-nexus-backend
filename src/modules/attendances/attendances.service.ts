import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAttendanceInput } from './dto/query-attendance.input';
import { JwtPayload } from '../auth/jwt.strategy';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import * as dayjs from 'dayjs';
import { UpdateAttendanceInput } from './dto/update-attendance.input';
import { CreateAttendanceInput } from './dto/create-attendance.input';
import { Prisma } from 'generated/prisma';
import { NotificationsService } from '../notifications/notifications.service';
import { minutesToHoursAndMinutes } from 'src/utils/time.utils';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import {
  ApproveAttendanceInput,
  RejectAttendanceInput,
} from './dto/approve-attendance.input';
import { RequestAttendanceInput } from './dto/request-attendance.input';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);
dayjs.extend(utc);

@Injectable()
export class AttendancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Calculate work minutes between punchIn and punchOut using dayjs
   * Returns minutes as a number
   */
  private calculateWorkMinutes(punchIn: Date, punchOut: Date): number {
    const start = dayjs(punchIn);
    const end = dayjs(punchOut);
    return end.diff(start, 'minute');
  }

  /**
   * Calculate total minutes from punch records
   */
  private calculateTotalMinutes(
    punchRecords: {
      punchIn: Date;
      punchOut?: Date | null;
      breakMinutes?: number | null;
    }[],
  ): {
    totalMinutes: number;
    breakMinutes: number;
  } {
    let totalMinutes = 0;
    let breakMinutes = 0;

    for (const punch of punchRecords) {
      if (punch?.punchIn && punch?.punchOut) {
        const minutes = this.calculateWorkMinutes(
          punch.punchIn,
          punch.punchOut,
        );
        totalMinutes += minutes;
      }
      if (punch?.breakMinutes) {
        breakMinutes += Number(punch.breakMinutes);
      }
    }

    return { totalMinutes, breakMinutes };
  }

  /**
   * Get employee's active schedule for a specific date
   * Returns the schedule with workSchedule included
   */
  private async getEmployeeSchedule(userId: number, date: Date) {
    return await this.prisma.employeeSchedule.findFirst({
      where: {
        userId,
        isActive: true,
        startDate: {
          lte: date,
        },
        OR: [
          { endDate: null },
          {
            endDate: {
              gte: date,
            },
          },
        ],
      },
      include: {
        workSchedule: true,
      },
    });
  }

  /**
   * Apply unpaid break deduction if applicable
   * Returns adjusted total minutes
   */
  private applyBreakDeduction(
    totalMinutes: number,
    employeeSchedule: Awaited<ReturnType<typeof this.getEmployeeSchedule>>,
  ): number {
    if (employeeSchedule?.workSchedule.breakType === 'UNPAID') {
      const scheduleBreakMinutes =
        employeeSchedule.workSchedule.breakMinutes || 0;
      return Math.max(0, totalMinutes - scheduleBreakMinutes);
    }
    return totalMinutes;
  }

  /**
   * Calculate schedule minutes for a specific user and date
   * Returns the total scheduled minutes based on the work schedule
   */
  async calculateScheduleMinutes(userId: number, date: Date): Promise<number> {
    let scheduleMinutes = 0;
    const attendanceDay = dayjs(date).day();

    // Find the active schedule for this user on this date
    const activeSchedule = await this.prisma.employeeSchedule.findFirst({
      where: {
        userId,
        isActive: true,
        startDate: {
          lte: dayjs(date).toDate(),
        },
        OR: [
          { endDate: null },
          {
            endDate: {
              gte: dayjs(date).toDate(),
            },
          },
        ],
      },
      include: {
        workSchedule: {
          include: {
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
        },
      },
    });

    if (activeSchedule) {
      const daySchedule = activeSchedule.workSchedule.schedules.find(
        (s) => s.dayOfWeek === attendanceDay,
      );

      if (daySchedule?.timeSlots && daySchedule.timeSlots.length > 0) {
        // Calculate total time from all time slots
        const totalSlotMinutes = daySchedule.timeSlots.reduce((total, slot) => {
          // Parse time strings (format: "HH:mm" or "HH:mm:ss")
          const start = dayjs(slot.startTime, ['HH:mm:ss', 'HH:mm'], true);
          const end = dayjs(slot.endTime, ['HH:mm:ss', 'HH:mm'], true);

          if (!start.isValid() || !end.isValid()) {
            return total;
          }

          return total + end.diff(start, 'minute');
        }, 0);

        scheduleMinutes = totalSlotMinutes;
      }
    }

    return scheduleMinutes;
  }

  // ATTENDANCE OVERVIEW
  async getAttendanceOverview() {
    // Execute all queries in parallel for single round trip
    const [total, statusGroups, typeGroups] = await Promise.all([
      this.prisma.attendance.count(),
      this.prisma.attendance.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.attendance.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
    ]);

    const overview = {
      total,
      pending: 0,
      approved: 0,
      rejected: 0,
      absent: 0,
      regular: 0,
      late: 0,
      partial: 0,
    };

    statusGroups.forEach((item) => {
      overview[item.status] = item._count.status;
    });

    typeGroups.forEach((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      overview[item.type] = item._count.type;
    });

    return overview;
  }

  // REQUEST ATTENDANCE
  async requestAttendance({
    user,
    requestAttendanceInput,
  }: {
    user: JwtPayload;
    requestAttendanceInput: RequestAttendanceInput;
  }) {
    const { punchRecords, ...attendanceData } = requestAttendanceInput;

    // Calculate totals if punch records are provided
    let totalMinutes = 0;
    let breakMinutes = 0;
    let overtimeMinutes = 0;

    if (punchRecords && punchRecords.length > 0) {
      const calculated = this.calculateTotalMinutes(punchRecords);
      totalMinutes = calculated.totalMinutes;
      breakMinutes = calculated.breakMinutes;
    }

    // Get employee's active schedule and apply break deduction if unpaid
    const employeeSchedule = await this.getEmployeeSchedule(
      user.userId,
      attendanceData.date,
    );

    if (employeeSchedule === null) {
      overtimeMinutes = totalMinutes;
    }

    totalMinutes =
      employeeSchedule !== null
        ? this.applyBreakDeduction(totalMinutes, employeeSchedule)
        : 0;

    if (totalMinutes > 480) {
      overtimeMinutes = totalMinutes - 480;
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        ...attendanceData,
        userId: user.userId,
        totalMinutes,
        overtimeMinutes,
        breakMinutes,
        punchRecords: punchRecords
          ? {
              create: punchRecords.map((punch) => {
                const workMinutes =
                  punch.punchIn && punch.punchOut
                    ? this.calculateWorkMinutes(punch.punchIn, punch.punchOut)
                    : 0;
                return {
                  ...punch,
                  punchInBy: user.userId,
                  punchOutBy: user.userId,
                  workMinutes,
                  breakMinutes: punch.breakMinutes || 0,
                };
              }),
            }
          : undefined,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        punchRecords: {
          include: {
            project: true,
            workSite: true,
          },
        },
      },
    });

    // Send notification to manager or owner
    try {
      const recipientId =
        await this.notificationsService.findNotificationRecipient(
          attendance.userId,
          user.businessId,
        );
      if (recipientId) {
        await this.notificationsService.sendFromTemplate(
          'attendance_created',
          recipientId,
          {
            employeeName: attendance.user.profile?.fullName || 'Employee',
            date: dayjs(attendance.date).format('MMM DD, YYYY'),
            workTime: minutesToHoursAndMinutes(totalMinutes),
            entityType: 'attendance',
            entityId: attendance.id.toString(),
            metaData: attendance,
          },
          user.businessId,
        );
      }
    } catch (error) {
      console.error('Failed to send attendance creation notification:', error);
    }

    return attendance;
  }

  // CREATE ATTENDANCE
  async create({
    user,
    createAttendanceInput,
  }: {
    user: JwtPayload;
    createAttendanceInput: CreateAttendanceInput;
  }) {
    const { punchRecords, ...attendanceData } = createAttendanceInput;

    // Calculate totals if punch records are provided
    let totalMinutes = 0;
    let breakMinutes = 0;
    let overtimeMinutes = 0;

    if (punchRecords && punchRecords.length > 0) {
      const calculated = this.calculateTotalMinutes(punchRecords);
      totalMinutes = calculated.totalMinutes;
      breakMinutes = calculated.breakMinutes;
    }

    // Get employee's active schedule and apply break deduction if unpaid
    const employeeSchedule = await this.getEmployeeSchedule(
      attendanceData.userId,
      attendanceData.date,
    );

    if (employeeSchedule === null) {
      overtimeMinutes = totalMinutes;
    }

    totalMinutes =
      employeeSchedule !== null
        ? this.applyBreakDeduction(totalMinutes, employeeSchedule)
        : 0;

    if (totalMinutes > 480) {
      overtimeMinutes = totalMinutes - 480;
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        ...attendanceData,
        totalMinutes,
        overtimeMinutes,
        breakMinutes,
        punchRecords: punchRecords
          ? {
              create: punchRecords.map((punch) => {
                const workMinutes =
                  punch.punchIn && punch.punchOut
                    ? this.calculateWorkMinutes(punch.punchIn, punch.punchOut)
                    : 0;
                return {
                  ...punch,
                  punchInBy: user.userId,
                  punchOutBy: user.userId,
                  workMinutes,
                };
              }),
            }
          : undefined,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        punchRecords: {
          include: {
            project: true,
            workSite: true,
          },
        },
      },
    });

    // Send notification to manager or owner
    try {
      const recipientId =
        await this.notificationsService.findNotificationRecipient(
          attendance.userId,
          user.businessId,
        );

      if (recipientId) {
        await this.notificationsService.sendFromTemplate(
          'attendance_created',
          recipientId,
          {
            employeeName: attendance.user.profile?.fullName || 'Employee',
            date: dayjs(attendance.date).format('MMM DD, YYYY'),
            workTime: minutesToHoursAndMinutes(totalMinutes),
            entityType: 'attendance',
            entityId: attendance.id.toString(),
            actionUrl: `/attendances/${attendance.id}`,
          },
          user.businessId,
        );
      }
    } catch (error) {
      console.error('Failed to send attendance creation notification:', error);
    }

    return attendance;
  }

  // FIND ALL ATTENDANCES
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryAttendanceInput;
  }) {
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { status, startDate, endDate, userId } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];

    // Filter by userId if provided, otherwise show all in business
    if (userId) {
      andCondition.push({ userId });
    } else {
      // Show all attendances for users in this business
      andCondition.push({
        user: {
          businessId,
        },
      });
    }

    // Add status filter
    if (status) {
      andCondition.push({ status });
    }

    // Add date range filter
    if (startDate || endDate) {
      const dateFilter: { gte?: Date; lte?: Date } = {};
      if (startDate) {
        dateFilter.gte = dayjs.utc(startDate).toDate();
      }
      if (endDate) {
        dateFilter.lte = dayjs.utc(endDate).toDate();
      }
      andCondition.push({ date: dateFilter });
    }

    const whereCondition: Prisma.AttendanceWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.attendance.findMany({
          where: whereCondition,
          orderBy: {
            date: 'asc',
          },
          include: {
            user: {
              include: {
                profile: true,
              },
            },
            punchRecords: {
              include: {
                project: true,
                workSite: true,
              },
            },
          },
        })
      : await this.prisma.attendance.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            user: {
              include: {
                profile: true,
              },
            },
            punchRecords: {
              include: {
                project: true,
                workSite: true,
              },
            },
          },
        });

    // META
    const total = await this.prisma.attendance.count({
      where: whereCondition,
    });

    return {
      meta: {
        page: Number(page),
        limit: Number(limit),
        skip: Number(skip),
        total: Number(total),
        totalPages: limit ? Math.ceil(total / limit) : 1,
      },
      data: result,
    };
  }

  // FIND ONE ATTENDANCE
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        punchRecords: {
          include: {
            project: true,
            workSite: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    // Verify user has access to this attendance
    if (user.businessId !== attendance.user.businessId) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  // UPDATE ATTENDANCE
  async update({
    user,
    updateAttendanceInput,
  }: {
    user: JwtPayload;
    updateAttendanceInput: UpdateAttendanceInput;
  }) {
    const { id, punchRecords, ...attendanceData } = updateAttendanceInput;

    // Verify attendance exists and user has access
    await this.findOne({ user, id: Number(id) });

    // If punch records are updated, recalculate totals
    let totalMinutes = 0;
    let breakMinutes = 0;

    if (punchRecords && punchRecords.length > 0) {
      const calculated = this.calculateTotalMinutes(punchRecords);
      totalMinutes = calculated.totalMinutes;
      breakMinutes = calculated.breakMinutes;

      // Handle punch record updates
      // Delete existing punch records and create new ones
      await this.prisma.attendancePunch.deleteMany({
        where: { attendanceId: Number(id) },
      });

      // Get employee's active schedule and apply break deduction if unpaid
      const attendance = await this.prisma.attendance.findUnique({
        where: { id: Number(id) },
        select: { userId: true, date: true },
      });

      if (attendance) {
        const employeeSchedule = await this.getEmployeeSchedule(
          attendance.userId,
          attendance.date,
        );
        totalMinutes = this.applyBreakDeduction(totalMinutes, employeeSchedule);
      }
    }

    const updatedAttendance = await this.prisma.attendance.update({
      where: { id: Number(id) },
      data: {
        ...attendanceData,
        totalMinutes,
        breakMinutes,
        punchRecords: punchRecords?.length
          ? {
              create: punchRecords.map((punch) => {
                const workMinutes =
                  punch.punchIn && punch.punchOut
                    ? this.calculateWorkMinutes(punch.punchIn, punch.punchOut)
                    : 0;
                return {
                  projectId: punch.projectId,
                  workSiteId: punch.workSiteId,
                  punchIn: punch.punchIn,
                  punchOut: punch.punchOut,
                  punchInBy: user.userId,
                  punchOutBy: punch.punchOut ? user.userId : null,
                  workMinutes,
                  breakMinutes: punch.breakMinutes || 0,
                  notes: punch.notes,
                };
              }),
            }
          : undefined,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        punchRecords: {
          include: {
            project: true,
            workSite: true,
          },
        },
      },
    });

    // Send notification to manager or owner
    try {
      const recipientId =
        await this.notificationsService.findNotificationRecipient(
          updatedAttendance.userId,
          user.businessId,
        );

      if (recipientId) {
        await this.notificationsService.sendFromTemplate(
          'attendance_updated',
          recipientId,
          {
            employeeName:
              updatedAttendance.user.profile?.fullName || 'Employee',
            date: dayjs(updatedAttendance.date).format('MMM DD, YYYY'),
            workTime: minutesToHoursAndMinutes(totalMinutes),
            entityType: 'attendance',
            entityId: updatedAttendance.id.toString(),
            actionUrl: `/attendances/${updatedAttendance.id}`,
          },
          user.businessId,
        );
      }
    } catch (error) {
      console.error('Failed to send attendance update notification:', error);
    }

    return updatedAttendance;
  }

  // DELETE ATTENDANCE
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    const attendance = await this.findOne({ user, id });

    const deletedAttendance = await this.prisma.attendance.delete({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Send notification to manager or owner
    try {
      const recipientId =
        await this.notificationsService.findNotificationRecipient(
          attendance.userId,
          user.businessId,
        );

      if (recipientId) {
        await this.notificationsService.sendFromTemplate(
          'attendance_deleted',
          recipientId,
          {
            employeeName:
              deletedAttendance.user.profile?.fullName || 'Employee',
            date: dayjs(attendance.date).format('MMM DD, YYYY'),
            entityType: 'attendance',
            entityId: id.toString(),
            actionUrl: `/attendances`,
          },
          user.businessId,
        );
      }
    } catch (error) {
      console.error('Failed to send attendance deletion notification:', error);
    }

    return deletedAttendance;
  }

  // FIND ONE ATTENDANCE
  async getTodayAttendance({ user }: { user: JwtPayload }) {
    const attendance = await this.prisma.attendance.findFirstOrThrow({
      where: {
        userId: user.userId,
        date: dayjs.utc().toISOString(),
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        punchRecords: {
          include: {
            project: true,
            workSite: true,
          },
        },
      },
    });

    // if (!attendance) {
    //   throw new NotFoundException(`Attendance with ID ${id} not found`);
    // }

    // // Verify user has access to this attendance
    // if (user.businessId !== attendance.user.businessId) {
    //   throw new NotFoundException(`Attendance with ID ${id} not found`);
    // }

    return attendance;
  }

  // PUNCH IN
  async punchIn({
    user,
    data,
  }: {
    user: JwtPayload;
    data: {
      projectId?: number;
      workSiteId?: number;
      punchInIp?: string;
      punchInLat?: number;
      punchInLng?: number;
      punchInDevice?: string;
      notes?: string;
    };
  }) {
    const today = dayjs.utc().format('YYYY-MM-DD');
    const userId = user.userId;

    const targetUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { employee: true, profile: true },
    });

    // Find or create attendance record for today
    let attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: dayjs.utc(today).toISOString(),
      },
    });

    if (!attendance) {
      attendance = await this.prisma.attendance.create({
        data: {
          userId,
          date: dayjs.utc(today).toISOString(),
          totalMinutes: 0,
          breakMinutes: 0,
          status: 'pending',
        },
      });
    }

    // Create punch record
    const punchRecord = await this.prisma.attendancePunch.create({
      data: {
        ...data,
        attendanceId: attendance.id,
        punchInBy: user.userId,
        punchIn: dayjs.utc().toISOString(),
        workMinutes: 0,
        breakMinutes: 0,
      },
      include: {
        attendance: true,
        project: true,
        workSite: true,
      },
    });

    // Send notification to manager or owner
    try {
      const recipientId =
        await this.notificationsService.findNotificationRecipient(
          userId,
          user.businessId,
        );
      if (recipientId) {
        await this.notificationsService.sendFromTemplate(
          'attendance_punch_in',
          recipientId,
          {
            employeeName: targetUser?.profile?.fullName || 'Employee',
            checkInTime: dayjs(punchRecord.punchIn).format('h:mm A'),
            date: dayjs(punchRecord.punchIn).format('MMM DD, YYYY'),
            entityType: 'attendance',
            entityId: attendance.id.toString(),
          },
          user.businessId,
        );
      }
    } catch (error) {
      // Log error but don't fail the punch in
      console.error('Failed to send punch in notification:', error);
    }

    return punchRecord;
  }

  // PUNCH OUT
  async punchOut({
    user,
    punchId,
    data,
  }: {
    user: JwtPayload;
    punchId: number;
    data: {
      punchOutIp?: string;
      punchOutLat?: number;
      punchOutLng?: number;
      punchOutDevice?: string;
      breakMinutes?: number;
      notes?: string;
    };
  }) {
    // Find punch record
    const punch = await this.prisma.attendancePunch.findUnique({
      where: { id: punchId },
      include: { attendance: true },
    });

    if (!punch) {
      throw new NotFoundException('Punch record not found');
    }

    if (punch.attendance.userId !== user.userId) {
      throw new NotFoundException('Punch record not found');
    }

    if (punch.punchOut) {
      throw new Error('Already punched out');
    }

    const punchOut = dayjs.utc().toDate();
    const workMinutes = this.calculateWorkMinutes(punch.punchIn, punchOut);

    // Update punch record
    const updatedPunch = await this.prisma.attendancePunch.update({
      where: { id: punchId },
      data: {
        punchOut,
        punchOutBy: user.userId,
        workMinutes,
        breakMinutes: data.breakMinutes || 0,
        punchOutIp: data.punchOutIp,
        punchOutLat: data.punchOutLat,
        punchOutLng: data.punchOutLng,
        punchOutDevice: data.punchOutDevice,
        notes: data.notes || punch.notes,
      },
      include: {
        attendance: true,
        project: true,
        workSite: true,
      },
    });

    // Update attendance totals
    const allPunches = await this.prisma.attendancePunch.findMany({
      where: { attendanceId: punch.attendanceId },
    });

    const totals = this.calculateTotalMinutes(allPunches);
    let finalTotalMinutes = totals.totalMinutes;

    // Get employee's active schedule and apply break deduction if unpaid
    const employeeSchedule = await this.getEmployeeSchedule(
      punch.attendance.userId,
      punch.attendance.date,
    );
    finalTotalMinutes = this.applyBreakDeduction(
      finalTotalMinutes,
      employeeSchedule,
    );

    await this.prisma.attendance.update({
      where: { id: punch.attendanceId },
      data: {
        totalMinutes: finalTotalMinutes,
        breakMinutes: totals.breakMinutes,
      },
    });

    // Send notification to manager or owner about punch out
    try {
      const recipientId =
        await this.notificationsService.findNotificationRecipient(
          punch.attendance.userId,
          user.businessId,
        );
      if (recipientId) {
        const userProfile = await this.prisma.user.findUnique({
          where: { id: punch.attendance.userId },
          include: { profile: true },
        });

        await this.notificationsService.sendFromTemplate(
          'attendance_punch_out',
          recipientId,
          {
            employeeName: userProfile?.profile?.fullName || 'Employee',
            checkOutTime: dayjs(punchOut).format('h:mm A'),
            workTime: minutesToHoursAndMinutes(workMinutes),
            entityType: 'attendance',
            entityId: punch.attendanceId.toString(),
            actionUrl: `/attendances/${punch.attendanceId}`,
          },
          user.businessId,
        );
      }
    } catch (error) {
      // Log error but don't fail the punch out
      console.error('Failed to send punch out notification:', error);
    }

    return updatedPunch;
  }

  // GET USER'S ATTENDANCE SUMMARY
  async getAttendanceSummary({
    user,
    userId,
    startDate,
    endDate,
  }: {
    user: JwtPayload;
    userId?: number;
    startDate: Date;
    endDate: Date;
  }) {
    const targetUserId = userId || user.userId;

    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId: targetUserId,
        date: {
          gte: dayjs.utc(startDate).toISOString(),
          lte: dayjs.utc(endDate).toISOString(),
        },
      },
      include: {
        punchRecords: true,
      },
    });

    const summary = {
      totalDays: attendances.length,
      totalMinutes: attendances.reduce((sum, a) => sum + a.totalMinutes, 0),
      totalBreakMinutes: attendances.reduce(
        (sum, a) => sum + a.breakMinutes,
        0,
      ),
      presentDays: attendances.filter((a) => a.status === 'present').length,
      absentDays: attendances.filter((a) => a.status === 'absent').length,
      lateDays: attendances.filter((a) => a.status === 'late').length,
      halfDays: attendances.filter((a) => a.status === 'half_day').length,
    };

    return {
      summary,
      attendances,
    };
  }

  // APPROVE ATTENDANCE
  async approveAttendance({
    user,
    approveAttendanceInput,
  }: {
    approveAttendanceInput: ApproveAttendanceInput;
    user: JwtPayload;
  }) {
    if (!user.businessId) {
      throw new NotFoundException('User does not belong to any business');
    }

    // Check if attendance exists
    await this.prisma.attendance.findUniqueOrThrow({
      where: { id: Number(approveAttendanceInput.attendanceId) },
    });

    // Update attendance status to approved
    const updatedAttendance = await this.prisma.attendance.update({
      where: { id: Number(approveAttendanceInput.attendanceId) },
      data: {
        status: 'approved',
        reviewedBy: user.userId,
        reviewedAt: dayjs.utc().toISOString(),
        remarks: approveAttendanceInput.remarks
          ? approveAttendanceInput.remarks
          : null,
      },
    });

    return updatedAttendance;
  }

  // REJECT ATTENDANCE
  async rejectAttendance({
    user,
    rejectAttendanceInput,
  }: {
    rejectAttendanceInput: RejectAttendanceInput;
    user: JwtPayload;
  }) {
    if (!user.businessId) {
      throw new NotFoundException('User does not belong to any business');
    }

    // Check if attendance exists
    await this.prisma.attendance.findUniqueOrThrow({
      where: { id: Number(rejectAttendanceInput.attendanceId) },
    });

    // Update attendance status to approved
    const updatedAttendance = await this.prisma.attendance.update({
      where: { id: Number(rejectAttendanceInput.attendanceId) },
      data: {
        status: 'rejected',
        remarks: rejectAttendanceInput.remarks,
        reviewedBy: user.userId,
        reviewedAt: dayjs.utc().toISOString(),
      },
    });

    return updatedAttendance;
  }
}
