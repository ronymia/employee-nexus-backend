/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AssignEmployeePayrollComponentInput,
  QueryEmployeePayrollComponentInput,
  UpdateEmployeePayrollComponentInput,
} from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma } from 'generated/prisma';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class EmployeePayrollComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ASSIGN PAYROLL COMPONENT TO EMPLOYEE
  async assign({
    user,
    input,
  }: {
    user: JwtPayload;
    input: AssignEmployeePayrollComponentInput;
  }) {
    // Verify component exists and belongs to same business
    await this.prisma.payrollComponent.findUniqueOrThrow({
      where: {
        id: input.payrollComponentId,
        businessId: user.businessId,
      },
    });

    // Verify employee exists and belongs to same business
    await this.prisma.user.findUniqueOrThrow({
      where: {
        id: input.userId,
        businessId: user.businessId,
      },
    });
    // Create assignment
    return await this.prisma.employeePayrollComponent.create({
      data: {
        ...input,
        assignedBy: user.userId,
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
        payrollComponent: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // UNASSIGN PAYROLL COMPONENT FROM EMPLOYEE
  async updateEmployeePayrollComponent({
    user,
    input,
  }: {
    user: JwtPayload;
    input: UpdateEmployeePayrollComponentInput;
  }) {
    if (!user.businessId) {
      throw new NotFoundException('Business not found for user');
    }
    // Find the assignment
    await this.prisma.employeePayrollComponent.findUniqueOrThrow({
      where: { id: input.id, userId: input.userId },
      include: {
        employee: true,
      },
    });

    // Delete the assignment
    return await this.prisma.employeePayrollComponent.update({
      where: { id: input.id },
      data: input,
      include: {
        employee: {
          include: {
            user: true,
          },
        },
        payrollComponent: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // GET ALL EMPLOYEE PAYROLL COMPONENTS
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryEmployeePayrollComponentInput;
  }) {
    const businessId = user.businessId;
    const { ...filters } = query ?? {};

    // FILTER
    const { userId, payrollComponentId } = filters;

    // QUERY BUILDER
    const andCondition: Prisma.EmployeePayrollComponentWhereInput[] = [];

    // Filter by userId
    if (userId) {
      andCondition.push({ userId });
    }

    // Filter by payrollComponentId
    if (payrollComponentId) {
      andCondition.push({ payrollComponentId });
    }

    // Filter by isActive
    // if (isActive !== undefined) {
    //   andCondition.push({ isActive });
    // }

    // Only show assignments for employees in the same business
    andCondition.push({
      employee: {
        user: {
          businessId: businessId,
        },
      },
    });

    const whereCondition: Prisma.EmployeePayrollComponentWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = await this.prisma.employeePayrollComponent.findMany({
      where: whereCondition,
      orderBy: { effectiveFrom: 'desc' },
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
        payrollComponent: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });

    return result;
  }

  // GET ONE EMPLOYEE PAYROLL COMPONENT
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    if (!user.businessId) {
      throw new NotFoundException('Business not found for user');
    }

    // Find the assignment
    const assignment =
      await this.prisma.employeePayrollComponent.findUniqueOrThrow({
        where: { id },
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
          payrollComponent: true,
          assignedByUser: {
            include: {
              profile: true,
            },
          },
        },
      });

    return assignment;
  }

  // GET ACTIVE EMPLOYEE PAYROLL COMPONENTS (effectiveTo is null or after today)
  async activeEmployeePayrollComponents({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryEmployeePayrollComponentInput;
  }) {
    const businessId = user.businessId;
    const { ...filters } = query ?? {};
    const today = dayjs.utc().toDate();
    today.setHours(0, 0, 0, 0);

    // FILTER
    const { userId, payrollComponentId } = filters;

    // QUERY BUILDER
    const andCondition: Prisma.EmployeePayrollComponentWhereInput[] = [];

    // Filter by userId
    if (userId) {
      andCondition.push({ userId });
    }

    // Filter by componentId
    if (payrollComponentId) {
      andCondition.push({ payrollComponentId });
    }

    // Active components: effectiveTo is null OR effectiveTo >= today
    andCondition.push({
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: today } }],
    });

    // Only active components
    // andCondition.push({ isActive: true });

    // Only show assignments for employees in the same business
    andCondition.push({
      employee: {
        user: {
          businessId: businessId,
        },
      },
    });

    const whereCondition: Prisma.EmployeePayrollComponentWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = await this.prisma.employeePayrollComponent.findMany({
      where: whereCondition,
      orderBy: { effectiveFrom: 'desc' },
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
        payrollComponent: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });

    return result;
  }

  // GET EMPLOYEE PAYROLL COMPONENT HISTORY (effectiveTo is before today)
  async employeePayrollComponentHistory({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryEmployeePayrollComponentInput;
  }) {
    const businessId = user.businessId;
    const { ...filters } = query ?? {};
    const today = dayjs.utc().toDate();
    today.setHours(0, 0, 0, 0);

    // FILTER
    const { userId, payrollComponentId } = filters;

    // QUERY BUILDER
    const andCondition: Prisma.EmployeePayrollComponentWhereInput[] = [];

    // Filter by userId
    if (userId) {
      andCondition.push({ userId });
    }

    // Filter by payrollComponentId
    if (payrollComponentId) {
      andCondition.push({ payrollComponentId });
    }

    // Historical components: effectiveTo < today
    andCondition.push({
      effectiveTo: { lt: today },
    });

    // Only show assignments for employees in the same business
    andCondition.push({
      employee: {
        user: {
          businessId: businessId,
        },
      },
    });

    const whereCondition: Prisma.EmployeePayrollComponentWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = await this.prisma.employeePayrollComponent.findMany({
      where: whereCondition,
      orderBy: { effectiveTo: 'desc' },
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
        payrollComponent: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });

    return result;
  }
}
