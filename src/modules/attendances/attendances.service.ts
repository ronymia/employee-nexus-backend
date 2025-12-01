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
import { ATTENDANCE_SEARCHABLE_FIELDS } from './attendance.constant';

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE ATTENDANCE
  async create({
    user,
    createAttendanceInput,
  }: {
    user: JwtPayload;
    createAttendanceInput: CreateAttendanceInput;
  }) {
    return await this.prisma.attendance.create({
      data: {
        ...createAttendanceInput,
        userId: user.userId,
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
  }

  // FIND ALL ATTENDANCES
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryAttendanceInput;
  }) {
    const { pagination, startDate, endDate, status } = query ?? {};

    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    const andCondition: any[] = [{ userId: user.userId }];

    // Filter by status
    if (status) {
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
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const result = await this.prisma.attendance.findFirst({
      where: {
        id,
        userId: user.userId,
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
    user,
    updateAttendanceInput,
  }: {
    user: JwtPayload;
    updateAttendanceInput: UpdateAttendanceInput;
  }) {
    const { id, ...data } = updateAttendanceInput;

    // Check if attendance exists and belongs to user
    await this.findOne({ user, id });

    return await this.prisma.attendance.update({
      where: { id },
      data,
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
  }

  // DELETE ATTENDANCE
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    // Check if attendance exists and belongs to user
    await this.findOne({ user, id });

    return await this.prisma.attendance.delete({
      where: { id },
    });
  }

  // CREATE PUNCH RECORD
  async createPunch({
    user,
    createAttendancePunchInput,
  }: {
    user: JwtPayload;
    createAttendancePunchInput: CreateAttendancePunchInput;
  }) {
    const { attendanceId, ...data } = createAttendancePunchInput;

    // Verify attendance belongs to user
    await this.findOne({ user, id: attendanceId });

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
