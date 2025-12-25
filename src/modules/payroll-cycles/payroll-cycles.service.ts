import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePayrollCycleInput,
  QueryPayrollCycleInput,
  ApprovePayrollCycleInput,
  ProcessPayrollCycleInput,
} from './dto';
import { PayrollCycleStatus } from './enums';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class PayrollCyclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: JwtPayload, input: CreatePayrollCycleInput) {
    return this.prisma.payrollCycle.create({
      data: {
        name: input.name,
        frequency: input.frequency,
        periodStart: new Date(input.periodStart),
        periodEnd: new Date(input.periodEnd),
        paymentDate: new Date(input.paymentDate),
        notes: input.notes,
        businessId: user.businessId,
        status: PayrollCycleStatus.DRAFT,
        totalGrossPay: 0,
        totalDeductions: 0,
        totalNetPay: 0,
        totalEmployees: 0,
      },
    });
  }

  async findAll(user: JwtPayload, query: QueryPayrollCycleInput) {
    return this.prisma.payrollCycle.findMany({
      where: {
        businessId: query.businessId ?? user.businessId,
        ...(query.status && { status: query.status }),
      },
      orderBy: { periodStart: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.payrollCycle.findUnique({
      where: { id },
      include: {
        payrollItems: {
          include: {
            user: {
              include: {
                profile: true,
                employee: {
                  include: {
                    department: true,
                    designation: true,
                    employmentStatus: true,
                    workSchedule: true,
                    workSites: {
                      include: {
                        workSite: true,
                      },
                    },
                  },
                },
              },
            },
            components: {
              include: {
                component: true,
                payrollItem: true,
              },
            },
            adjustments: {
              include: {
                payrollItem: true,
              },
            },
          },
        },
      },
    });
  }

  async approve(
    user: JwtPayload,
    approvePayrollCycleInput: ApprovePayrollCycleInput,
  ) {
    return this.prisma.payrollCycle.update({
      where: { id: approvePayrollCycleInput.id },
      data: {
        status: PayrollCycleStatus.APPROVED,
        approvedBy: user.userId,
        approvedAt: new Date(),
      },
    });
  }

  async process(
    user: JwtPayload,
    processPayrollCycleInput: ProcessPayrollCycleInput,
  ) {
    return this.prisma.payrollCycle.update({
      where: { id: processPayrollCycleInput.id },
      data: {
        status: PayrollCycleStatus.PROCESSING,
        processedBy: user.userId,
        processedAt: new Date(),
      },
    });
  }

  async markAsPaid(id: number) {
    return this.prisma.payrollCycle.update({
      where: { id },
      data: {
        status: PayrollCycleStatus.PAID,
      },
    });
  }

  async cancel(id: number) {
    return this.prisma.payrollCycle.delete({
      where: { id },
      // data: {
      //   status: PayrollCycleStatus.CANCELLED,
      // },
    });
  }

  async updateTotals(id: number) {
    const cycle = await this.prisma.payrollCycle.findUnique({
      where: { id },
      include: {
        payrollItems: true,
      },
    });

    if (!cycle) {
      throw new Error('Payroll cycle not found');
    }

    const totalGrossPay = cycle.payrollItems.reduce(
      (sum, item) => sum + item.grossPay,
      0,
    );
    const totalDeductions = cycle.payrollItems.reduce(
      (sum, item) => sum + item.totalDeductions,
      0,
    );
    const totalNetPay = cycle.payrollItems.reduce(
      (sum, item) => sum + item.netPay,
      0,
    );
    const totalEmployees = cycle.payrollItems.length;

    return this.prisma.payrollCycle.update({
      where: { id },
      data: {
        totalGrossPay,
        totalDeductions,
        totalNetPay,
        totalEmployees,
      },
    });
  }
}
