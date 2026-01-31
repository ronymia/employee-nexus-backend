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

  // GET DEPARTMENT HISTORY FOR USER
  async getDepartmentHistory({
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

    return await this.prisma.employeeDepartment.findMany({
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
        department: true,
      },
    });
  }

  // GET ACTIVE DEPARTMENT FOR USER
  async getActiveDepartment({
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

    return await this.prisma.employeeDepartment.findFirst({
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
        department: true,
      },
    });
  }

  // GET EMPLOYEE DEPARTMENT BY COMPOSITE ID
  async getByCompositeId({
    user,
    userId,
    departmentId,
  }: {
    user: JwtPayload;
    userId: number;
    departmentId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const employeeDepartment = await this.prisma.employeeDepartment.findUnique({
      where: {
        userId_departmentId: {
          userId,
          departmentId,
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
        department: true,
      },
    });

    if (!employeeDepartment) {
      throw new NotFoundException(`Employee department assignment not found`);
    }

    // Verify belongs to business
    if (employeeDepartment.employee.user.businessId !== businessId) {
      throw new NotFoundException(
        `Employee department assignment not found in your business`,
      );
    }

    return employeeDepartment;
  }

  // UPDATE EMPLOYEE DEPARTMENT
  async updateEmployeeDepartment({
    user,
    userId,
    departmentId,
    updateData,
  }: {
    user: JwtPayload;
    userId: number;
    departmentId: number;
    updateData: Partial<AssignEmployeeDepartmentInput>;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // Verify assignment exists and belongs to business
    await this.getByCompositeId({ user, userId, departmentId });

    // If setting as primary, unset other primary departments
    if (updateData.isPrimary) {
      await this.prisma.employeeDepartment.updateMany({
        where: {
          userId,
          isPrimary: true,
          NOT: {
            departmentId,
          },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return await this.prisma.employeeDepartment.update({
      where: {
        userId_departmentId: {
          userId,
          departmentId,
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
        department: true,
      },
    });
  }
}
