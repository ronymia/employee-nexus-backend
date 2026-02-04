import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeSalaryInput } from './dto/create-employee-salary.input';
import { UpdateEmployeeSalaryInput } from './dto/update-employee-salary.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { QueryEmployeeSalaryInput } from './dto/query-employee-salary.input';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class EmployeeSalariesService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE SALARY RECORD
  async create({
    user,
    createEmployeeSalaryInput,
  }: {
    user: JwtPayload;
    createEmployeeSalaryInput: CreateEmployeeSalaryInput;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // Verify the user exists and belongs to the business
    const targetUser = await this.prisma.user.findUnique({
      where: { id: createEmployeeSalaryInput.userId },
      include: { employee: true },
    });

    if (!targetUser || targetUser.businessId !== businessId) {
      throw new NotFoundException(
        `Employee with ID ${createEmployeeSalaryInput.userId} not found in your business`,
      );
    }

    if (!targetUser.employee) {
      throw new NotFoundException(
        `User with ID ${createEmployeeSalaryInput.userId} is not an employee`,
      );
    }

    // If this is an active salary, deactivate other active salaries for this user
    const activeSalaries = await this.prisma.employeeSalary.findMany({
      where: {
        userId: createEmployeeSalaryInput.userId,
        isActive: true,
      },
    });

    // Use transaction to ensure consistency
    return await this.prisma.$transaction(async (tx) => {
      // Deactivate existing active salaries
      if (activeSalaries.length > 0) {
        await tx.employeeSalary.updateMany({
          where: {
            userId: createEmployeeSalaryInput.userId,
            isActive: true,
          },
          data: {
            isActive: false,
            endDate: dayjs
              .utc(createEmployeeSalaryInput.startDate)
              .toISOString(),
          },
        });
      }

      // Create new salary record
      return await tx.employeeSalary.create({
        data: {
          userId: createEmployeeSalaryInput.userId,
          salaryAmount: createEmployeeSalaryInput.salaryAmount,
          salaryType: createEmployeeSalaryInput.salaryType,
          startDate: dayjs
            .utc(createEmployeeSalaryInput.startDate)
            .toISOString(),
          endDate: createEmployeeSalaryInput.endDate
            ? dayjs.utc(createEmployeeSalaryInput.endDate).toISOString()
            : null,
          reason: createEmployeeSalaryInput.reason,
          remarks: createEmployeeSalaryInput.remarks,
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
        },
      });
    });
  }

  // FIND ALL SALARIES
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryEmployeeSalaryInput;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // BUILD WHERE CONDITION
    const andCondition: Prisma.EmployeeSalaryWhereInput[] = [
      {
        employee: {
          user: {
            businessId,
          },
        },
      },
    ];

    if (filters.userId !== undefined) {
      andCondition.push({ userId: filters.userId });
    }

    if (filters.salaryType !== undefined) {
      andCondition.push({ salaryType: filters.salaryType as any });
    }

    if (filters.isActive !== undefined) {
      andCondition.push({ isActive: filters.isActive });
    }

    const whereCondition: Prisma.EmployeeSalaryWhereInput =
      andCondition.length > 1 ? { AND: andCondition } : andCondition[0];

    // GET RESULTS
    const result = !limit
      ? await this.prisma.employeeSalary.findMany({
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
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        })
      : await this.prisma.employeeSalary.findMany({
          where: whereCondition,
          skip,
          take: limit,
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
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
        });

    // GET TOTAL COUNT
    const total = await this.prisma.employeeSalary.count({
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

  // FIND ONE SALARY
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const salary = await this.prisma.employeeSalary.findFirst({
      where: {
        id,
        employee: {
          user: {
            businessId,
          },
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
      },
    });

    if (!salary) {
      throw new NotFoundException(`Salary record with ID ${id} not found`);
    }

    return salary;
  }

  // UPDATE SALARY
  async update({
    user,
    updateEmployeeSalaryInput,
  }: {
    user: JwtPayload;
    updateEmployeeSalaryInput: UpdateEmployeeSalaryInput;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // Verify salary exists and belongs to business
    await this.findOne({ user, id: updateEmployeeSalaryInput.id });

    const updateData: Prisma.EmployeeSalaryUpdateInput = {};

    if (updateEmployeeSalaryInput.salaryAmount !== undefined) {
      updateData.salaryAmount = updateEmployeeSalaryInput.salaryAmount;
    }
    if (updateEmployeeSalaryInput.salaryType !== undefined) {
      updateData.salaryType = updateEmployeeSalaryInput.salaryType as any;
    }
    if (updateEmployeeSalaryInput.startDate !== undefined) {
      updateData.startDate = dayjs
        .utc(updateEmployeeSalaryInput.startDate)
        .toISOString();
    }
    if (updateEmployeeSalaryInput.endDate !== undefined) {
      updateData.endDate = dayjs
        .utc(updateEmployeeSalaryInput.endDate)
        .toISOString();
    }
    if (updateEmployeeSalaryInput.isActive !== undefined) {
      updateData.isActive = updateEmployeeSalaryInput.isActive;
    }
    if (updateEmployeeSalaryInput.reason !== undefined) {
      updateData.reason = updateEmployeeSalaryInput.reason;
    }
    if (updateEmployeeSalaryInput.remarks !== undefined) {
      updateData.remarks = updateEmployeeSalaryInput.remarks;
    }

    return await this.prisma.employeeSalary.update({
      where: { id: updateEmployeeSalaryInput.id },
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
      },
    });
  }

  // DELETE SALARY
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // Verify salary exists and belongs to business
    await this.findOne({ user, id });

    return await this.prisma.employeeSalary.delete({
      where: { id },
    });
  }

  // GET ACTIVE SALARY FOR USER
  async getActiveSalary(userId: number) {
    return await this.prisma.employeeSalary.findFirst({
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
      },
    });
  }

  // GET SALARY HISTORY FOR USER
  async getSalaryHistory({
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

    return await this.prisma.employeeSalary.findMany({
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
      },
    });
  }
}
