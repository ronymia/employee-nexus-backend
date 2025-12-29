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
}
