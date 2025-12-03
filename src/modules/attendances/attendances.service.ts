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

@Injectable()
export class AttendancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // CREATE ATTENDANCE
  async create({
    user,
    createAttendanceInput,
  }: {
    user: JwtPayload;
    createAttendanceInput: CreateAttendanceInput;
  }) {
    const { punchRecords, ...attendanceData } = createAttendanceInput;

    return await this.prisma.$transaction(async (prisma) => {
      const attendance = await prisma.attendance.create({
        data: {
          ...attendanceData,
          ...(punchRecords && {
            punchRecords: {
              create: punchRecords.map(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        await this.notificationsService.create({
          type: 'ATTENDANCE',
          title: 'Attendance Recorded',
          message: `Your attendance for ${new Date(attendance.date).toLocaleDateString()} has been recorded successfully.`,
          priority: 'LOW' as any,
          userId: attendanceData.userId,
          channels: ['IN_APP'],
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
        for (const punchRecord of punchRecords) {
          const {
            id: punchId,
            attendanceId,
            ...punchData
          } = punchRecord as any;

          if (punchId) {
            // Update existing punch record
            await prisma.attendancePunch.update({
              where: { id: punchId, AND: { attendanceId } },
              data: punchData,
            });
          } else {
            // Create new punch record
            await prisma.attendancePunch.create({
              data: {
                ...punchData,
                attendanceId: id,
              },
            });
          }
        }
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
    const { attendanceId, ...data } = createAttendancePunchInput;

    // Verify attendance belongs to user
    await this.findOne({ id: attendanceId });

    return await this.prisma.attendancePunch.create({
      data: {
        ...data,
        attendanceId,
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
}
