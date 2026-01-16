import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveInput } from './dto/create-leave.input';
import { UpdateLeaveInput } from './dto/update-leave.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryLeaveInput } from './dto/query-leave.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { leaveSearchableFields } from './leave.constant';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestLeaveInput } from './dto/request-leave.input';
import { NotificationChannel, NotificationType } from '../notifications/enums';

@Injectable()
export class LeavesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async leaveRequest({
    user,
    createLeaveInput,
  }: {
    user: JwtPayload;
    createLeaveInput: RequestLeaveInput;
  }) {
    const leaveType = await this.prisma.leaveType.findUnique({
      where: {
        id: createLeaveInput.leaveTypeId,
      },
    });
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: createLeaveInput.userId,
      },
      include: {
        employee: {
          include: {
            departments: {
              where: { isActive: true },
              include: {
                department: true,
              },
            },
          },
        },
        business: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // if (existingUser.business.userId !== user.userId) {
    //   throw new NotFoundException(
    //     'You do not have permission to request leave for this user',
    //   );
    // }

    // const leave = await this.prisma.leave.create({
    //   data: {
    //     ...createLeaveInput,
    //     status: 'pending',
    //     startDate: new Date(createLeaveInput.startDate),
    //     endDate: createLeaveInput.endDate
    //       ? new Date(createLeaveInput.endDate)
    //       : null,
    //   },
    //   include: {
    //     user: {
    //       include: {
    //         profile: true,
    //       },
    //     },
    //     leaveType: true,
    //     reviewer: true,
    //   },
    // });

    // Send notification to user
    // try {
    //   const startDate = new Date(leave.startDate).toLocaleDateString();
    //   const endDate = leave.endDate
    //     ? new Date(leave.endDate).toLocaleDateString()
    //     : startDate;

    //   // Get the first active department's manager ID
    //   const activeDepartment = existingUser?.employee?.departments?.[0];
    //   const managerId = activeDepartment?.department?.managerId;

    //   await this.notificationsService.create({
    //     type: NotificationType.LEAVE,
    //     title: 'Leave Requested',
    //     message: `Your leave request from ${startDate} to ${endDate} has been submitted successfully and is pending review.`,
    //     priority: 'NORMAL' as any,
    //     userId: managerId || user.userId,
    //     channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    //     businessId: user.businessId,
    //     entityType: 'leave',
    //     entityId: leave.id,
    //   });
    // } catch (error) {
    //   console.error('Failed to send leave notification:', error);
    // }

    return {};
  }
  create({
    user,
    createLeaveInput,
  }: {
    user: JwtPayload;
    createLeaveInput: CreateLeaveInput;
  }) {
    // const leave = await this.prisma.leave.create({
    //   data: {
    //     ...createLeaveInput,
    //     status: 'approved',
    //     startDate: new Date(createLeaveInput.startDate),
    //     endDate: createLeaveInput.endDate
    //       ? new Date(createLeaveInput.endDate)
    //       : null,
    //   },
    //   include: {
    //     user: {
    //       include: {
    //         profile: true,
    //       },
    //     },
    //     leaveType: true,
    //     reviewer: true,
    //   },
    // });

    // Send notification to user
    try {
      // const startDate = new Date(leave.startDate).toLocaleDateString();
      // const endDate = leave.endDate
      //   ? new Date(leave.endDate).toLocaleDateString()
      //   : startDate;
      // await this.notificationsService.create({
      //   type: NotificationType.LEAVE,
      //   title: 'Leave Recorded',
      //   message: `Your leave request from ${startDate} to ${endDate} has been submitted successfully and is pending review.`,
      //   priority: 'NORMAL' as any,
      //   userId: createLeaveInput.userId,
      //   channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      //   businessId: user.businessId,
      //   entityType: 'leave',
      //   entityId: leave.id,
      // });
    } catch (error) {
      console.error('Failed to send leave notification:', error);
    }

    return {};
  }

  async findAll({ user, query }: { user: JwtPayload; query: QueryLeaveInput }) {
    console.log(user);
    const userId = query?.userId;
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
            user: {
              include: {
                profile: true,
              },
            },
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
            user: {
              include: {
                profile: true,
              },
            },
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

  async findOne({ id }: { id: number }) {
    const result = await this.prisma.leave.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        leaveType: true,
        reviewer: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return result;
  }

  async update({ updateLeaveInput }: { updateLeaveInput: UpdateLeaveInput }) {
    const { id, ...updateData } = updateLeaveInput;

    // Ensure the leave exists
    await this.findOne({ id }); // Ensure the leave exists

    return await this.prisma.leave.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        leaveType: true,
        reviewer: true,
      },
    });
  }

  async remove({ id }: { id: number }) {
    await this.findOne({ id }); // Ensure the leave exists
    return await this.prisma.leave.delete({
      where: { id },
    });
  }

  // Update leave status (for managers/admins) with notification
  async updateLeaveStatus({
    id,
    status,
    reviewerId,
    reviewerNotes,
  }: {
    id: number;
    status: 'approved' | 'rejected' | 'cancelled';
    reviewerId: number;
    reviewerNotes?: string;
  }) {
    const leave = await this.prisma.leave.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        leaveType: true,
        reviewer: true,
      },
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    const updatedLeave = await this.prisma.leave.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        rejectionReason: reviewerNotes || null,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        leaveType: true,
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Send notification to user
    try {
      // const startDate = new Date(updatedLeave.startDate).toLocaleDateString();
      // const endDate = updatedLeave.endDate
      //   ? new Date(updatedLeave.endDate).toLocaleDateString()
      //   : startDate;
      // const reviewerName =
      //   updatedLeave.reviewer?.profile?.fullName || 'Manager';
      // let title = '';
      // let message = '';
      // if (status === 'approved') {
      //   title = 'Leave Request Approved';
      //   message = `Your leave request from ${startDate} to ${endDate} has been approved by ${reviewerName}.`;
      // } else if (status === 'rejected') {
      //   title = 'Leave Request Rejected';
      //   message = `Your leave request from ${startDate} to ${endDate} has been rejected by ${reviewerName}.${reviewerNotes ? ` Reason: ${reviewerNotes}` : ''}`;
      // } else if (status === 'cancelled') {
      //   title = 'Leave Request Cancelled';
      //   message = `Your leave request from ${startDate} to ${endDate} has been cancelled.`;
      // }
      // await this.notificationsService.create(
      //   {
      //   type: NotificationType.LEAVE,
      //   title,
      //   message,
      //   priority: 'HIGH' as any,
      //   userId: updatedLeave.userId,
      //   channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      //   businessId: leave.user.businessId || undefined,
      //   entityType: 'leave',
      //   entityId: updatedLeave.id,
      // });
    } catch (error) {
      console.error('Failed to send leave status notification:', error);
    }

    return updatedLeave;
  }

  // Leave balance calculation with employmentStatusId filter
  async getLeaveBalance({
    user,
    leaveTypeId,
    userId,
    year,
  }: {
    user: JwtPayload;
    leaveTypeId: number;
    userId: number;
    year: number;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        employee: {
          include: {
            employmentStatuses: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Get active employment status if needed
    const activeEmploymentStatus =
      existingUser?.employee?.employmentStatuses?.find((es) => es.isActive);
    const employmentStatusId = activeEmploymentStatus?.employmentStatusId;
    // Get leave type with employment status validation
    const leaveType = await this.prisma.leaveType.findFirst({
      where: {
        id: leaveTypeId,
        // employmentStatuses: {
        //   some: {
        //     employmentStatusId: employmentStatusId,
        //   },
        // },
      },
    });

    if (!leaveType) {
      throw new NotFoundException(
        `Leave type with ID ${leaveTypeId} not found or not available for the employment status`,
      );
    }

    // Get total used minutes for the year
    const usedMinutes = await this.prisma.leave.aggregate({
      where: {
        userId,
        leaveTypeId,
        leaveYear: year,
        status: 'approved',
      },
      _sum: {
        totalMinutes: true,
      },
    });

    const allocatedMinutes = leaveType.leaveMinutes;
    const usedMinutesValue = usedMinutes._sum?.totalMinutes || 0;
    const remaining = allocatedMinutes - usedMinutesValue;

    return {
      leaveTypeId,
      leaveTypeName: leaveType.name,
      year,
      allocatedMinutes,
      usedMinutesValue,
      remainingMinutes: remaining,
    };
  }

  // APPROVE ATTENDANCE
  async approveLeave({ leaveId: id }: { leaveId: number }) {
    // Verify punch exists and belongs to user's attendance
    const leave = await this.prisma.leave.findUnique({
      where: {
        id: id,
      },
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return await this.prisma.leave.update({
      where: { id: id },
      data: { status: 'approved' },
    });
  }
  // APPROVE ATTENDANCE
  async rejectLeave({ leaveId: id }: { leaveId: number }) {
    // Verify punch exists and belongs to user's attendance
    const leave = await this.prisma.leave.findUnique({
      where: {
        id: id,
      },
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return await this.prisma.leave.update({
      where: { id: id },
      data: { status: 'rejected' },
    });
  }
}
