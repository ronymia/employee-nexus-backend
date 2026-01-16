import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignEmployeeStatusInput } from './dto/assign-employee-status.input';
import { GetEmployeeStatusesInput } from './dto/get-employee-statuses.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class EmployeeEmploymentStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  // ASSIGN EMPLOYMENT STATUS TO EMPLOYEE
  async assignEmployeeStatus({
    user,
    assignEmployeeStatusInput,
  }: {
    user: JwtPayload;
    assignEmployeeStatusInput: AssignEmployeeStatusInput;
  }) {
    const {
      userId,
      employmentStatusId,
      isActive = true,
      ...dataFields
    } = assignEmployeeStatusInput;

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

    // Validate employment status exists and belongs to business
    const employmentStatus = await this.prisma.employmentStatus.findFirst({
      where: {
        id: employmentStatusId,
        businessId: user.businessId,
      },
    });

    if (!employmentStatus) {
      throw new HttpException(
        `Employment status with ID ${employmentStatusId} not found or does not belong to your business`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // If setting as active, deactivate other active statuses for this user
    if (isActive) {
      await this.prisma.employeeStatus.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    // Create or update employee status
    return await this.prisma.employeeStatus.upsert({
      where: {
        userId_employmentStatusId: {
          userId,
          employmentStatusId,
        },
      },
      create: {
        userId,
        employmentStatusId,
        isActive,
        ...dataFields,
      },
      update: {
        isActive,
        ...dataFields,
      },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        employmentStatus: true,
      },
    });
  }

  // GET EMPLOYEE EMPLOYMENT STATUSES
  async getEmployeeStatuses({
    user,
    getEmployeeStatusesInput,
  }: {
    user: JwtPayload;
    getEmployeeStatusesInput?: GetEmployeeStatusesInput;
  }) {
    const { userId, employmentStatusId, isActive } =
      getEmployeeStatusesInput || {};

    const whereCondition: {
      employee?: { user?: { businessId?: number } };
      userId?: number;
      employmentStatusId?: number;
      isActive?: boolean;
    } = {
      employee: {
        user: {
          businessId: user.businessId,
        },
      },
    };

    if (userId !== undefined) {
      whereCondition.userId = userId;
    }

    if (employmentStatusId !== undefined) {
      whereCondition.employmentStatusId = employmentStatusId;
    }

    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    return await this.prisma.employeeStatus.findMany({
      where: whereCondition,
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        employmentStatus: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}
