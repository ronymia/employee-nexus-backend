/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceInput } from './dto/create-attendance.input';
import { UpdateAttendanceInput } from './dto/update-attendance.input';
import { QueryAttendanceInput } from './dto/query-attendance.input';
import { CreateAttendancePunchInput } from './dto/create-attendance-punch.input';
import { UpdateAttendancePunchInput } from './dto/update-attendance-punch.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestAttendanceInput } from './dto/request-attendance.input';
import { NotificationChannel, NotificationType } from '../notifications/enums';
import * as dayjs from 'dayjs';

@Injectable()
export class AttendancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Calculate work hours between punchIn and punchOut using dayjs
   * Returns hours as a decimal (e.g., 8.5 for 8 hours 30 minutes)
   */
  private calculateWorkHours(
    punchIn: Date | string,
    punchOut?: Date | string,
  ): number {
    if (!punchOut) {
      return 0;
    }
    const punchInTime = dayjs(punchIn);
    const punchOutTime = dayjs(punchOut);
    const differenceInHours = punchOutTime.diff(punchInTime, 'hour', true);
    return Math.round(differenceInHours * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate total work hours from all punch records
   */
  private calculateTotalHours(punchRecords: any[]): number {
    const totalHours = punchRecords.reduce((sum, record) => {
      const workHours = this.calculateWorkHours(
        record.punchIn,
        record.punchOut,
      );
      return sum + workHours;
    }, 0);
    return Math.round(totalHours * 100) / 100; // Round to 2 decimal places
  }

  // CREATE ATTENDANCE
  async attendanceRequest({
    user,
    createAttendanceInput,
  }: {
    user: JwtPayload;
    createAttendanceInput: RequestAttendanceInput;
  }) {
    // EXTRACT PUNCH RECORDS AND ATTENDANCE DATA
    const { punchRecords, ...attendanceData } = createAttendanceInput;

    // CHECK IF ATTENDANCE ALREADY EXISTS FOR THIS USER AND DATE
    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId: attendanceData.userId,
        date: new Date(attendanceData.date),
      },
    });

    if (existingAttendance) {
      throw new Error('Attendance already exists for this user and date');
    }

    if (!punchRecords || punchRecords.length === 0) {
      throw new Error('Punch records are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: attendanceData.userId },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        business: {
          select: { id: true, ownerId: true },
        },
      },
    });
    if (!existingUser) {
      throw new Error('User not found');
    }
    if (existingUser.businessId !== user.businessId) {
      throw new Error('User does not belong to this business');
    }

    // CALCULATE WORK HOURS FOR EACH PUNCH RECORD AND TOTAL HOURS
    const punchRecordsWithHours = punchRecords.map((record) => {
      const workHours = this.calculateWorkHours(
        record.punchIn,
        record.punchOut,
      );
      return {
        ...record,
        workHours,
      };
    });

    // CALCULATE TOTAL HOURS FOR THE DAY
    const totalHours = this.calculateTotalHours(punchRecordsWithHours);

    return await this.prisma.$transaction(async (prisma) => {
      const attendance = await prisma.attendance.create({
        data: {
          ...attendanceData,
          status: 'pending',
          totalHours, // Set calculated total hours
          ...(punchRecordsWithHours && {
            punchRecords: {
              create: punchRecordsWithHours.map(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (punchData) => punchData,
              ),
            },
          }),
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

      // Send notification to user
      try {
        await this.notificationsService.create({
          type: NotificationType.ATTENDANCE,
          title: 'Attendance Requested',
          message: `Your attendance for ${new Date(attendance.date).toLocaleDateString()} has been recorded successfully. Total hours: ${totalHours}h`,
          priority: 'LOW' as any,
          userId:
            (existingUser?.employee?.department?.managerId as number) ||
            (existingUser?.business?.ownerId as number),
          channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
          businessId: user.businessId,
          entityType: 'attendance',
          entityId: attendance.id,
        });
      } catch (error) {
        console.error('Failed to send attendance notification:', error);
      }

      return attendance;
    });
  }
  // CREATE ATTENDANCE
  async create({
    user,
    createAttendanceInput,
  }: {
    user: JwtPayload;
    createAttendanceInput: CreateAttendanceInput;
  }) {
    // EXTRACT PUNCH RECORDS AND ATTENDANCE DATA
    const { punchRecords, ...attendanceData } = createAttendanceInput;

    // CALCULATE WORK HOURS FOR EACH PUNCH RECORD AND TOTAL HOURS
    let totalHours = 0;
    let punchRecordsWithHours: any[] = [];

    if (punchRecords && punchRecords.length > 0) {
      punchRecordsWithHours = punchRecords.map((record) => {
        const workHours = this.calculateWorkHours(
          record.punchIn,
          record.punchOut,
        );
        totalHours += workHours;
        return {
          ...record,
          workHours,
        };
      });
      totalHours = Math.round(totalHours * 100) / 100; // Round to 2 decimal places
    }

    return await this.prisma.$transaction(async (prisma) => {
      const attendance = await prisma.attendance.create({
        data: {
          ...attendanceData,
          totalHours: totalHours > 0 ? totalHours : undefined,
          ...(punchRecordsWithHours &&
            punchRecordsWithHours.length > 0 && {
              punchRecords: {
                create: punchRecordsWithHours.map(
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-return
                  ({ attendanceId, ...punchData }) => punchData,
                ),
              },
            }),
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

      // Send notification to user
      try {
        const message =
          totalHours > 0
            ? `Your attendance for ${dayjs(attendance.date).format('MM/DD/YYYY')} has been recorded successfully. Total hours: ${totalHours}h`
            : `Your attendance for ${dayjs(attendance.date).format('MM/DD/YYYY')} has been recorded successfully.`;

        await this.notificationsService.create({
          type: NotificationType.ATTENDANCE,
          title: 'Attendance Recorded',
          message,
          priority: 'LOW' as any,
          userId: attendanceData.userId,
          channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
          businessId: user.businessId,
          entityType: 'attendance',
          entityId: attendance.id,
        });
      } catch (error) {
        console.error('Failed to send attendance notification:', error);
      }

      return attendance;
    });
  }

  // FIND ALL ATTENDANCES
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryAttendanceInput;
  }) {
    console.log(user);
    const { pagination, startDate, endDate, status } = query ?? {};

    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    const andCondition: any[] = [];

    if (query?.userId) {
      andCondition.push({ userId: query.userId });
    }
    if (status) {
      // Filter by status
      andCondition.push({ status });
    }

    // Filter by date range
    if (startDate && endDate) {
      andCondition.push({
        date: {
          gte: startDate,
          lte: endDate,
        },
      });
    } else if (startDate) {
      andCondition.push({
        date: {
          gte: startDate,
        },
      });
    } else if (endDate) {
      andCondition.push({
        date: {
          lte: endDate,
        },
      });
    }

    const whereCondition: Prisma.AttendanceWhereInput = {
      AND: andCondition,
    };

    const result = await this.prisma.attendance.findMany({
      where: whereCondition,
      // skip,
      // take: limit,
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

    const total = await this.prisma.attendance.count({
      where: whereCondition,
    });

    return {
      meta: {
        page: Number(page),
        limit: Number(limit),
        skip: Number(skip),
        total: Number(total),
        totalPages: Math.ceil(total / limit),
      },
      data: result,
    };
  }

  // FIND ONE ATTENDANCE
  async findOne({ id }: { id: number }) {
    // console.log(user)
    const result = await this.prisma.attendance.findUnique({
      where: {
        id,
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

    if (!result) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return result;
  }

  // UPDATE ATTENDANCE
  async update({
    updateAttendanceInput,
  }: {
    updateAttendanceInput: UpdateAttendanceInput;
  }) {
    const { id, punchRecords, ...data } = updateAttendanceInput;

    // Check if attendance exists and belongs to user
    await this.findOne({ id });

    return await this.prisma.$transaction(async (prisma) => {
      // Update attendance without punch records first
      await prisma.attendance.update({
        where: { id },
        data,
      });

      // Update punch records if provided
      if (punchRecords && punchRecords.length > 0) {
        // Get existing punch record IDs from the database
        const existingPunchRecords = await prisma.attendancePunch.findMany({
          where: { attendanceId: id },
          select: { id: true },
        });

        const existingPunchIds = existingPunchRecords.map(
          (record) => record.id,
        );

        // Get punch record IDs from frontend (only those being updated)
        const frontendPunchIds = punchRecords
          .map((record: any) => record.id)
          .filter(Boolean); // Filter out undefined/null IDs

        // Find IDs to delete (exist in DB but not in frontend data)
        const idsToDelete = existingPunchIds.filter(
          (existingId) => !frontendPunchIds.includes(existingId),
        );

        // Delete punch records that are not in the frontend data
        if (idsToDelete.length > 0) {
          await prisma.attendancePunch.deleteMany({
            where: {
              id: { in: idsToDelete },
              attendanceId: id,
            },
          });
        }

        // Update or create punch records
        for (const punchRecord of punchRecords) {
          const {
            id: punchId,
            attendanceId,
            ...punchData
          } = punchRecord as any;

          if (punchId) {
            // Update existing punch record
            await prisma.attendancePunch.update({
              where: { id: punchId, attendanceId: id },
              data: punchData,
            });
          } else {
            // Create new punch record
            await prisma.attendancePunch.create({
              data: {
                ...punchData,
                attendanceId,
              },
            });
          }
        }
      } else {
        // If no punch records provided, delete all existing ones
        await prisma.attendancePunch.deleteMany({
          where: { attendanceId: id },
        });
      }

      // Fetch and return the updated attendance with punch records
      return await prisma.attendance.findUnique({
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
    });
  }

  // DELETE ATTENDANCE
  async remove({ id }: { id: number }) {
    // Check if attendance exists and belongs to user
    await this.findOne({ id });

    return await this.prisma.attendance.delete({
      where: { id },
    });
  }

  // CREATE PUNCH RECORD
  async createPunch({
    createAttendancePunchInput,
  }: {
    createAttendancePunchInput: CreateAttendancePunchInput;
  }) {
    const { ...data } = createAttendancePunchInput;

    // Verify attendance belongs to user
    // await this.findOne({ id: attendanceId });

    return await this.prisma.attendancePunch.create({
      data: {
        ...data,
        attendanceId: 1,
      },
      include: {
        attendance: true,
        project: true,
        workSite: true,
      },
    });
  }

  // UPDATE PUNCH RECORD
  async updatePunch({
    user,
    updateAttendancePunchInput,
  }: {
    user: JwtPayload;
    updateAttendancePunchInput: UpdateAttendancePunchInput;
  }) {
    const { id, ...data } = updateAttendancePunchInput;

    // Verify punch exists and belongs to user's attendance
    const punch = await this.prisma.attendancePunch.findFirst({
      where: {
        id,
        attendance: {
          userId: user.userId,
        },
      },
    });

    if (!punch) {
      throw new NotFoundException(`Attendance punch with ID ${id} not found`);
    }

    return await this.prisma.attendancePunch.update({
      where: { id },
      data,
      include: {
        attendance: true,
        project: true,
        workSite: true,
      },
    });
  }

  // DELETE PUNCH RECORD
  async removePunch({ user, id }: { user: JwtPayload; id: number }) {
    // Verify punch exists and belongs to user's attendance
    const punch = await this.prisma.attendancePunch.findFirst({
      where: {
        id,
        attendance: {
          userId: user.userId,
        },
      },
    });

    if (!punch) {
      throw new NotFoundException(`Attendance punch with ID ${id} not found`);
    }

    return await this.prisma.attendancePunch.delete({
      where: { id },
    });
  }

  // APPROVE ATTENDANCE
  async approveAttendance({ attendanceId: id }: { attendanceId: number }) {
    // Verify punch exists and belongs to user's attendance
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        id: id,
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance punch with ID ${id} not found`);
    }

    return await this.prisma.attendance.update({
      where: { id: id },
      data: { status: 'approved' },
    });
  }
  // APPROVE ATTENDANCE
  async rejectAttendance({ attendanceId: id }: { attendanceId: number }) {
    // Verify punch exists and belongs to user's attendance
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        id: id,
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance punch with ID ${id} not found`);
    }

    return await this.prisma.attendance.update({
      where: { id: id },
      data: { status: 'rejected' },
    });
  }

  // GET ATTENDANCE SUMMARY
  async getAttendanceSummary({
    user,
    startDate,
    endDate,
    userId,
  }: {
    user: JwtPayload;
    startDate?: Date;
    endDate?: Date;
    userId?: number;
  }) {
    const whereCondition: any = {
      user: {
        businessId: user.businessId,
      },
    };

    if (userId) {
      whereCondition.userId = userId;
    }

    if (startDate && endDate) {
      whereCondition.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      whereCondition.date = {
        gte: startDate,
      };
    } else if (endDate) {
      whereCondition.date = {
        lte: endDate,
      };
    }

    const summary = await this.prisma.attendance.groupBy({
      by: ['status'],
      where: whereCondition,
      _count: {
        status: true,
      },
    });

    const result = {
      pending: 0,
      approved: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
    };

    summary.forEach((item) => {
      const status = item.status.toLowerCase();
      if (status === 'pending') result.pending = item._count.status;
      else if (status === 'approved') result.approved = item._count.status;
      else if (status === 'absent') result.absent = item._count.status;
      else if (status === 'late') result.late = item._count.status;
      else if (status === 'half_day') result.halfDay = item._count.status;
    });

    return result;
  }
}
