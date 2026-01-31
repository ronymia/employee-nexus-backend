import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignEmployeeScheduleInput } from './dto/assign-employee-schedule.input';
import { GetEmployeeSchedulesInput } from './dto/get-employee-schedules.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class EmployeeWorkSchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  // ASSIGN WORK SCHEDULE TO EMPLOYEE
  async assignEmployeeSchedule({
    user,
    assignEmployeeScheduleInput,
  }: {
    user: JwtPayload;
    assignEmployeeScheduleInput: AssignEmployeeScheduleInput;
  }) {
    const {
      userId,
      workScheduleId,
      isActive = true,
      ...dataFields
    } = assignEmployeeScheduleInput;

    // Validate employee exists and belongs to business
    const employee = await this.prisma.employee.findFirst({
      where: {
        userId,
        user: {
          businessId: user.businessId,
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with user ID ${userId} not found or does not belong to your business`,
      );
    }

    // Validate work schedule exists and belongs to business
    const workSchedule = await this.prisma.workSchedule.findFirst({
      where: {
        id: workScheduleId,
        businessId: user.businessId,
      },
    });

    if (!workSchedule) {
      throw new HttpException(
        `Work schedule with ID ${workScheduleId} not found or does not belong to your business`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // If setting as active, deactivate other active schedules for this user
    if (isActive) {
      await this.prisma.employeeSchedule.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    // Create or update employee schedule
    return await this.prisma.employeeSchedule.upsert({
      where: {
        userId_workScheduleId: {
          userId,
          workScheduleId,
        },
      },
      create: {
        userId,
        workScheduleId,
        isActive,
        assignedBy: user.userId, // Track who assigned the schedule
        ...dataFields,
      },
      update: {
        isActive,
        assignedBy: user.userId, // Update assignedBy on modifications
        ...dataFields,
      },
      include: {
        user: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // GET EMPLOYEE WORK SCHEDULES
  async getEmployeeSchedules({
    user,
    getEmployeeSchedulesInput,
  }: {
    user: JwtPayload;
    getEmployeeSchedulesInput?: GetEmployeeSchedulesInput;
  }) {
    const { userId, workScheduleId, isActive } =
      getEmployeeSchedulesInput || {};

    const whereCondition: {
      user?: { user?: { businessId?: number } };
      userId?: number;
      workScheduleId?: number;
      isActive?: boolean;
    } = {
      user: {
        user: {
          businessId: user.businessId,
        },
      },
    };

    if (userId !== undefined) {
      whereCondition.userId = userId;
    }

    if (workScheduleId !== undefined) {
      whereCondition.workScheduleId = workScheduleId;
    }

    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    return await this.prisma.employeeSchedule.findMany({
      where: whereCondition,
      include: {
        user: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  // GET WORK SCHEDULE HISTORY FOR USER
  async getWorkScheduleHistory({
    user,
    userId,
  }: {
    user: JwtPayload;
    userId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // Verify user belongs to business
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser || targetUser.businessId !== businessId) {
      throw new NotFoundException(
        `User with ID ${userId} not found in your business`,
      );
    }

    return await this.prisma.employeeSchedule.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
      include: {
        user: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSchedule: {
          include: {
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
        },
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // GET ACTIVE WORK SCHEDULE FOR USER
  async getActiveWorkSchedule({
    user,
    userId,
  }: {
    user: JwtPayload;
    userId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser || targetUser.businessId !== businessId) {
      throw new NotFoundException(
        `User with ID ${userId} not found in your business`,
      );
    }

    return await this.prisma.employeeSchedule.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        user: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSchedule: {
          include: {
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
        },
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // GET BY COMPOSITE ID
  async getByCompositeId({
    user,
    userId,
    workScheduleId,
  }: {
    user: JwtPayload;
    userId: number;
    workScheduleId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const employeeSchedule = await this.prisma.employeeSchedule.findUnique({
      where: {
        userId_workScheduleId: {
          userId,
          workScheduleId,
        },
      },
      include: {
        user: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSchedule: {
          include: {
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
        },
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!employeeSchedule) {
      throw new NotFoundException(`Employee schedule assignment not found`);
    }

    if (employeeSchedule.user.user.businessId !== businessId) {
      throw new NotFoundException(
        `Employee schedule assignment not found in your business`,
      );
    }

    return employeeSchedule;
  }

  // UPDATE EMPLOYEE SCHEDULE
  async updateEmployeeSchedule({
    user,
    userId,
    workScheduleId,
    updateData,
  }: {
    user: JwtPayload;
    userId: number;
    workScheduleId: number;
    updateData: Partial<AssignEmployeeScheduleInput>;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    await this.getByCompositeId({ user, userId, workScheduleId });

    if (updateData.isActive) {
      await this.prisma.employeeSchedule.updateMany({
        where: {
          userId,
          isActive: true,
          NOT: {
            workScheduleId,
          },
        },
        data: {
          isActive: false,
        },
      });
    }

    return await this.prisma.employeeSchedule.update({
      where: {
        userId_workScheduleId: {
          userId,
          workScheduleId,
        },
      },
      data: {
        ...updateData,
        assignedBy: user.userId,
      },
      include: {
        user: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSchedule: {
          include: {
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
        },
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
