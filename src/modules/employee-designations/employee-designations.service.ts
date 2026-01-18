import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignEmployeeDesignationInput } from './dto/assign-employee-designation.input';
import { GetEmployeeDesignationsInput } from './dto/get-employee-designations.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class EmployeeDesignationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ASSIGN DESIGNATION TO EMPLOYEE
  async assignEmployeeDesignation({
    user,
    assignEmployeeDesignationInput,
  }: {
    user: JwtPayload;
    assignEmployeeDesignationInput: AssignEmployeeDesignationInput;
  }) {
    const {
      userId,
      designationId,
      isActive = true,
      ...dataFields
    } = assignEmployeeDesignationInput;

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

    // Validate designation exists and belongs to business
    const designation = await this.prisma.designation.findFirst({
      where: {
        id: designationId,
        businessId: user.businessId,
      },
    });

    if (!designation) {
      throw new HttpException(
        `Designation with ID ${designationId} not found or does not belong to your business`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // If setting as active, deactivate other active designations for this user
    if (isActive) {
      await this.prisma.employeeDesignation.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    // Create or update employee designation
    return await this.prisma.employeeDesignation.upsert({
      where: {
        userId_designationId: {
          userId,
          designationId,
        },
      },
      create: {
        userId,
        designationId,
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
        designation: true,
      },
    });
  }

  async getEmployeeDesignations({
    user,
    getEmployeeDesignationsInput,
  }: {
    user: JwtPayload;
    getEmployeeDesignationsInput?: GetEmployeeDesignationsInput;
  }) {
    const { userId, designationId, isActive } =
      getEmployeeDesignationsInput || {};

    const whereCondition: {
      employee?: { user?: { businessId?: number } };
      userId?: number;
      designationId?: number;
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

    if (designationId !== undefined) {
      whereCondition.designationId = designationId;
    }

    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    return await this.prisma.employeeDesignation.findMany({
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
        designation: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  // GET DESIGNATION HISTORY FOR USER
  async getDesignationHistory({
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

    return await this.prisma.employeeDesignation.findMany({
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
        designation: true,
      },
    });
  }

  // GET ACTIVE DESIGNATION FOR USER
  async getActiveDesignation({
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

    return await this.prisma.employeeDesignation.findFirst({
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
        designation: true,
      },
    });
  }

  // GET BY COMPOSITE ID
  async getByCompositeId({
    user,
    userId,
    designationId,
  }: {
    user: JwtPayload;
    userId: number;
    designationId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const employeeDesignation =
      await this.prisma.employeeDesignation.findUnique({
        where: {
          userId_designationId: {
            userId,
            designationId,
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
          designation: true,
        },
      });

    if (!employeeDesignation) {
      throw new NotFoundException(`Employee designation assignment not found`);
    }

    if (employeeDesignation.employee.user.businessId !== businessId) {
      throw new NotFoundException(
        `Employee designation assignment not found in your business`,
      );
    }

    return employeeDesignation;
  }

  // UPDATE EMPLOYEE DESIGNATION
  async updateEmployeeDesignation({
    user,
    userId,
    designationId,
    updateData,
  }: {
    user: JwtPayload;
    userId: number;
    designationId: number;
    updateData: Partial<AssignEmployeeDesignationInput>;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    await this.getByCompositeId({ user, userId, designationId });

    if (updateData.isActive) {
      await this.prisma.employeeDesignation.updateMany({
        where: {
          userId,
          isActive: true,
          NOT: {
            designationId,
          },
        },
        data: {
          isActive: false,
        },
      });
    }

    return await this.prisma.employeeDesignation.update({
      where: {
        userId_designationId: {
          userId,
          designationId,
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
        designation: true,
      },
    });
  }
}
