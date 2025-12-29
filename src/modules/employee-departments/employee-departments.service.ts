import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignEmployeeDepartmentInput } from './dto/assign-employee-department.input';
import { GetEmployeeDepartmentsInput } from './dto/get-employee-departments.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class EmployeeDepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ASSIGN DEPARTMENT TO EMPLOYEE
  async assignEmployeeDepartment({
    user,
    assignEmployeeDepartmentInput,
  }: {
    user: JwtPayload;
    assignEmployeeDepartmentInput: AssignEmployeeDepartmentInput;
  }) {
    const {
      userId,
      departmentId,
      isPrimary = false,
      isActive = true,
      roleInDept = 'member',
      ...dataFields
    } = assignEmployeeDepartmentInput;

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

    // Validate department exists and belongs to business
    const department = await this.prisma.department.findFirst({
      where: {
        id: departmentId,
        businessId: user.businessId,
      },
    });

    if (!department) {
      throw new HttpException(
        `Department with ID ${departmentId} not found or does not belong to your business`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // If setting as primary, unset other primary departments for this user
    if (isPrimary) {
      await this.prisma.employeeDepartment.updateMany({
        where: {
          userId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create or update employee department
    return await this.prisma.employeeDepartment.upsert({
      where: {
        userId_departmentId: {
          userId,
          departmentId,
        },
      },
      create: {
        userId,
        departmentId,
        isPrimary,
        isActive,
        roleInDept,
        ...dataFields,
      },
      update: {
        isPrimary,
        isActive,
        roleInDept,
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
        department: true,
      },
    });
  }

  // GET EMPLOYEE DEPARTMENTS
  async getEmployeeDepartments({
    user,
    getEmployeeDepartmentsInput,
  }: {
    user: JwtPayload;
    getEmployeeDepartmentsInput?: GetEmployeeDepartmentsInput;
  }) {
    const { userId, departmentId, isPrimary, isActive } =
      getEmployeeDepartmentsInput || {};

    const whereCondition: {
      employee?: { user?: { businessId?: number } };
      userId?: number;
      departmentId?: number;
      isPrimary?: boolean;
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

    if (departmentId !== undefined) {
      whereCondition.departmentId = departmentId;
    }

    if (isPrimary !== undefined) {
      whereCondition.isPrimary = isPrimary;
    }

    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    return await this.prisma.employeeDepartment.findMany({
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
        department: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}
