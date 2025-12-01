import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveInput } from './dto/create-leave.input';
import { UpdateLeaveInput } from './dto/update-leave.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryLeaveInput } from './dto/query-leave.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { leaveSearchableFields } from './leave.constant';

@Injectable()
export class LeavesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createLeaveInput,
  }: {
    user: JwtPayload;
    createLeaveInput: CreateLeaveInput;
  }) {
    return await this.prisma.leave.create({
      data: {
        ...createLeaveInput,
        userId: user.userId,
        startDate: new Date(createLeaveInput.startDate),
        endDate: createLeaveInput.endDate
          ? new Date(createLeaveInput.endDate)
          : null,
      },
      include: {
        user: true,
        leaveType: true,
        reviewer: true,
      },
    });
  }

  async findAll({ user, query }: { user: JwtPayload; query: QueryLeaveInput }) {
    const userId = user.userId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const {
      searchTerm,
      leaveTypeId,
      leaveYear,
      leaveDuration,
      status,
      startDate,
      endDate,
    } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];

    // Search in fields
    if (searchTerm) {
      andCondition.push({
        OR: leaveSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    // Filter by leave type
    if (leaveTypeId) {
      andCondition.push({ leaveTypeId });
    }

    // Filter by leave year
    if (leaveYear) {
      andCondition.push({ leaveYear });
    }

    // Filter by leave duration
    if (leaveDuration) {
      andCondition.push({ leaveDuration });
    }

    // Filter by status
    if (status) {
      andCondition.push({ status });
    }

    // Filter by date range
    if (startDate) {
      andCondition.push({
        startDate: {
          gte: new Date(startDate),
        },
      });
    }

    if (endDate) {
      andCondition.push({
        startDate: {
          lte: new Date(endDate),
        },
      });
    }

    const whereCondition: Prisma.LeaveWhereInput = {
      userId,
      ...(andCondition.length ? { AND: andCondition } : {}),
    };

    const result = !limit
      ? await this.prisma.leave.findMany({
          where: whereCondition,
          include: {
            user: true,
            leaveType: true,
            reviewer: true,
          },
        })
      : await this.prisma.leave.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            user: true,
            leaveType: true,
            reviewer: true,
          },
        });

    // META
    const total = await this.prisma.leave.count({
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

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const userId = user.userId;
    const result = await this.prisma.leave.findUnique({
      where: { id, userId },
      include: {
        user: true,
        leaveType: true,
        reviewer: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return result;
  }

  async update({
    user,
    id,
    updateLeaveInput,
  }: {
    user: JwtPayload;
    id: number;
    updateLeaveInput: UpdateLeaveInput;
  }) {
    await this.findOne({ user, id }); // Ensure the leave exists

    const updateData: any = { ...updateLeaveInput };
    if (updateLeaveInput.startDate) {
      updateData.startDate = new Date(updateLeaveInput.startDate);
    }
    if (updateLeaveInput.endDate) {
      updateData.endDate = new Date(updateLeaveInput.endDate);
    }

    return await this.prisma.leave.update({
      where: { id, userId: user.userId },
      data: updateData,
      include: {
        user: true,
        leaveType: true,
        reviewer: true,
      },
    });
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the leave exists
    return await this.prisma.leave.delete({
      where: { id, userId: user.userId },
    });
  }

  // Leave balance calculation with employmentStatusId filter
  async getLeaveBalance({
    user,
    leaveTypeId,
    employmentStatusId,
    year,
  }: {
    user: JwtPayload;
    leaveTypeId: number;
    employmentStatusId: number;
    year: number;
  }) {
    const userId = user.userId;

    // Get leave type with employment status validation
    const leaveType = await this.prisma.leaveType.findFirst({
      where: {
        id: leaveTypeId,
        employmentStatuses: {
          some: {
            employmentStatusId: employmentStatusId,
          },
        },
      },
    });

    if (!leaveType) {
      throw new NotFoundException(
        `Leave type with ID ${leaveTypeId} not found or not available for the employment status`,
      );
    }

    // Get total used hours for the year
    const usedHours = await this.prisma.leave.aggregate({
      where: {
        userId,
        leaveTypeId,
        leaveYear: year,
        status: 'approved',
      },
      _sum: {
        totalHours: true,
      },
    });

    const allocatedHours = leaveType.leaveHours;
    const used = usedHours._sum.totalHours || 0;
    const remaining = allocatedHours - used;

    return {
      leaveTypeId,
      leaveTypeName: leaveType.name,
      year,
      allocatedHours,
      usedHours: used,
      remainingHours: remaining,
    };
  }
}
