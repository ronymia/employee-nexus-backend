import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePayrollComponentInput,
  UpdatePayrollComponentInput,
  QueryPayrollComponentInput,
} from './dto';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma } from 'generated/prisma';

@Injectable()
export class PayrollComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  // PAYROLL COMPONENT OVERVIEW
  async getPayrollComponentOverview({ user }: { user: JwtPayload }) {
    const businessId = user.businessId;

    // Execute all queries in parallel for single round trip
    const [
      total,
      componentTypeGroups,
      calculationTypeGroups,
      statusGroups,
      taxableCount,
      nonTaxableCount,
      statutoryCount,
      nonStatutoryCount,
    ] = await Promise.all([
      this.prisma.payrollComponent.count({ where: { businessId } }),
      this.prisma.payrollComponent.groupBy({
        by: ['componentType'],
        where: { businessId },
        _count: { componentType: true },
      }),
      this.prisma.payrollComponent.groupBy({
        by: ['calculationType'],
        where: { businessId },
        _count: { calculationType: true },
      }),
      this.prisma.payrollComponent.groupBy({
        by: ['status'],
        where: { businessId },
        _count: { status: true },
      }),
      this.prisma.payrollComponent.count({
        where: { businessId, isTaxable: true },
      }),
      this.prisma.payrollComponent.count({
        where: { businessId, isTaxable: false },
      }),
      this.prisma.payrollComponent.count({
        where: { businessId, isStatutory: true },
      }),
      this.prisma.payrollComponent.count({
        where: { businessId, isStatutory: false },
      }),
    ]);

    const overview = {
      total,
      earning: 0,
      deduction: 0,
      fixedAmount: 0,
      percentageOfBasic: 0,
      active: 0,
      draft: 0,
      disabled: 0,
      taxable: taxableCount,
      nonTaxable: nonTaxableCount,
      statutory: statutoryCount,
      nonStatutory: nonStatutoryCount,
    };

    componentTypeGroups.forEach((item) => {
      const typeMap = {
        EARNING: 'earning',
        DEDUCTION: 'deduction',
      };
      const key = typeMap[item.componentType];
      if (key) {
        overview[key] = item._count.componentType;
      }
    });

    calculationTypeGroups.forEach((item) => {
      const calcMap = {
        FIXED_AMOUNT: 'fixedAmount',
        PERCENTAGE_OF_BASIC: 'percentageOfBasic',
      };
      const key = calcMap[item.calculationType];
      if (key) {
        overview[key] = item._count.calculationType;
      }
    });

    statusGroups.forEach((item) => {
      const statusMap = {
        ACTIVE: 'active',
        DRAFT: 'draft',
        DISABLED: 'disabled',
      };
      const key = statusMap[item.status];
      if (key) {
        overview[key] = item._count.status;
      }
    });

    return overview;
  }

  async create(user: JwtPayload, input: CreatePayrollComponentInput) {
    return this.prisma.payrollComponent.create({
      data: {
        ...input,
        businessId: user.businessId,
      },
    });
  }

  async findAll(user: JwtPayload, query: QueryPayrollComponentInput) {
    const businessId = user.businessId;

    // FILTER
    const {
      searchTerm,
      componentType,
      calculationType,
      status,
      isTaxable,
      isStatutory,
    } = query ?? {};

    // QUERY BUILDER
    const andCondition: Prisma.PayrollComponentWhereInput[] = [];

    // Search in name, code, or description
    if (searchTerm) {
      andCondition.push({
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    // Filter by component type
    if (componentType) {
      andCondition.push({ componentType });
    }

    // Filter by calculation type
    if (calculationType) {
      andCondition.push({ calculationType });
    }

    // Filter by status
    if (status) {
      andCondition.push({ status });
    }

    // Filter by taxable
    if (isTaxable !== undefined) {
      andCondition.push({ isTaxable });
    }

    // Filter by statutory
    if (isStatutory !== undefined) {
      andCondition.push({ isStatutory });
    }

    const whereCondition: Prisma.PayrollComponentWhereInput = {
      businessId,
      ...(andCondition.length ? { AND: andCondition } : {}),
    };

    const result = await this.prisma.payrollComponent.findMany({
      where: whereCondition,
      orderBy: { displayOrder: 'asc' },
    });

    return result;
  }

  async findOne(id: number) {
    return this.prisma.payrollComponent.findUniqueOrThrow({
      where: { id },
    });
  }

  async findByCode(code: string, businessId: number) {
    return this.prisma.payrollComponent.findUniqueOrThrow({
      where: {
        code_businessId: {
          code,
          businessId,
        },
      },
    });
  }

  async findActiveComponents(businessId: number) {
    return this.prisma.payrollComponent.findMany({
      where: {
        businessId,
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async update(input: UpdatePayrollComponentInput) {
    const { id, ...data } = input;
    await this.findOne(id); // Ensure it exists
    return this.prisma.payrollComponent.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.payrollComponent.delete({
      where: { id },
    });
  }
}
