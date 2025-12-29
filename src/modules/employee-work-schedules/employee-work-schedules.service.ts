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
}
