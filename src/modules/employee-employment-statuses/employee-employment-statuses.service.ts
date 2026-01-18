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

  // GET EMPLOYMENT STATUS HISTORY FOR USER
  async getEmploymentStatusHistory({
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

    return await this.prisma.employeeStatus.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
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

  // GET ACTIVE EMPLOYMENT STATUS FOR USER
  async getActiveEmploymentStatus({
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

    return await this.prisma.employeeStatus.findFirst({
      where: {
        userId,
        isActive: true,
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

  // GET BY COMPOSITE ID
  async getByCompositeId({
    user,
    userId,
    employmentStatusId,
  }: {
    user: JwtPayload;
    userId: number;
    employmentStatusId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const employeeStatus = await this.prisma.employeeStatus.findUnique({
      where: {
        userId_employmentStatusId: {
          userId,
          employmentStatusId,
        },
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

    if (!employeeStatus) {
      throw new NotFoundException(`Employee status assignment not found`);
    }

    if (employeeStatus.employee.user.businessId !== businessId) {
      throw new NotFoundException(
        `Employee status assignment not found in your business`,
      );
    }

    return employeeStatus;
  }

  // UPDATE EMPLOYEE STATUS
  async updateEmployeeStatus({
    user,
    userId,
    employmentStatusId,
    updateData,
  }: {
    user: JwtPayload;
    userId: number;
    employmentStatusId: number;
    updateData: Partial<AssignEmployeeStatusInput>;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    await this.getByCompositeId({ user, userId, employmentStatusId });

    if (updateData.isActive) {
      await this.prisma.employeeStatus.updateMany({
        where: {
          userId,
          isActive: true,
          NOT: {
            employmentStatusId,
          },
        },
        data: {
          isActive: false,
        },
      });
    }

    return await this.prisma.employeeStatus.update({
      where: {
        userId_employmentStatusId: {
          userId,
          employmentStatusId,
        },
      },
      data: updateData,
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
}
