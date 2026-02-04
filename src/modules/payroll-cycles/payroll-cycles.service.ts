/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePayrollCycleInput,
  QueryPayrollCycleInput,
  ApprovePayrollCycleInput,
  ProcessPayrollCycleInput,
} from './dto';
import { PayrollCycleStatus } from './enums';
import { JwtPayload } from '../auth/jwt.strategy';
import { PayrollItemsService } from '../payroll-items/payroll-items.service';

@Injectable()
export class PayrollCyclesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => PayrollItemsService))
    private readonly payrollItemsService: PayrollItemsService,
  ) {}

  async create(user: JwtPayload, input: CreatePayrollCycleInput) {
    return this.prisma.payrollCycle.create({
      data: {
        name: input.name,
        frequency: input.frequency,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        paymentDate: input.paymentDate,
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
                    departments: true,
                    designations: true,
                    employmentStatuses: true,
                    workSchedules: true,
                    workSites: {
                      include: {
                        workSite: true,
                      },
                    },
                  },
                },
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
    if (!user.businessId) {
      throw new Error('User business ID is required to approve payroll cycle');
    }

    // Check if the user is authorized to approve the payroll cycle
    const payrollCycle = await this.prisma.payrollCycle.findUniqueOrThrow({
      where: {
        id: approvePayrollCycleInput.id,
        AND: {
          businessId: user.businessId,
        },
      },
      include: {
        payrollItems: {
          select: {
            id: true,
            status: true,
            userId: true,
          },
        },
      },
    });

    if (payrollCycle.status !== PayrollCycleStatus.PROCESSING) {
      throw new Error('Payroll cycle must be processing before approval');
    }

    // Check if all payroll items are approved
    const unapprovedItems = payrollCycle.payrollItems.filter(
      (item) => item.status !== 'APPROVED',
    );

    if (unapprovedItems.length > 0) {
      throw new Error(
        `Cannot approve payroll cycle. ${unapprovedItems.length} payroll item(s) are not approved yet. Please approve all payroll items first.`,
      );
    }

    return this.prisma.payrollCycle.update({
      where: { id: approvePayrollCycleInput.id },
      data: {
        status: PayrollCycleStatus.APPROVED,
        approvedBy: user.userId,
        approvedAt: new Date().toISOString(),
      },
    });
  }

  async process(
    user: JwtPayload,
    processPayrollCycleInput: ProcessPayrollCycleInput,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const payrollCycleId = processPayrollCycleInput.id;

      // Check if the user is authorized to process the payroll cycle
      const payrollCycle = await prisma.payrollCycle.findUniqueOrThrow({
        where: {
          id: payrollCycleId,
          AND: {
            businessId: user.businessId,
          },
        },
      });

      if (payrollCycle.status !== PayrollCycleStatus.DRAFT) {
        throw new Error('Payroll cycle must be draft before processing');
      }

      const businessId = user.businessId;

      // Get all active employees in the business
      const activeEmployees = await prisma.employee.findMany({
        where: {
          user: {
            businessId,
            // status: UserAccountStatus.ACTIVE,
          },
        },
        select: {
          userId: true,
        },
      });

      if (activeEmployees.length === 0) {
        throw new Error('No active employees found in the business');
      }

      // Create payroll items for all active employees
      for (const employee of activeEmployees) {
        // Check if payroll item already exists (unique constraint on payrollCycleId_userId)
        const existing = await this.payrollItemsService.findByUserId(
          payrollCycleId,
          employee.userId,
        );

        if (!existing) {
          await this.payrollItemsService.createPayrollItem({
            user,
            userId: employee.userId,
            payrollCycleId,
          });
        }
      }

      // Update payroll cycle status
      const updatedCycle = await prisma.payrollCycle.update({
        where: { id: payrollCycleId },
        data: {
          status: PayrollCycleStatus.PROCESSING,
          processedBy: user.userId,
          processedAt: new Date().toISOString(),
        },
        include: {
          payrollItems: true,
        },
      });

      return updatedCycle;
    });
  }

  async approvePayrollItems(user: JwtPayload, payrollCycleId: number) {
    return this.prisma.$transaction(async (prisma) => {
      // Verify user has access to this payroll cycle
      const payrollCycle = await prisma.payrollCycle.findUniqueOrThrow({
        where: {
          id: payrollCycleId,
          AND: {
            businessId: user.businessId,
          },
        },
        include: {
          payrollItems: {
            where: {
              status: 'PENDING',
            },
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (payrollCycle.payrollItems.length === 0) {
        throw new Error('No pending payroll items found for this cycle');
      }

      // Get the period dates from payroll cycle to match adjustments
      const cycleWithDates = await prisma.payrollCycle.findUniqueOrThrow({
        where: { id: payrollCycleId },
        select: {
          periodStart: true,
          periodEnd: true,
        },
      });

      // Get all pending payroll items with user details
      const pendingItems = await prisma.payrollItem.findMany({
        where: {
          payrollCycleId,
          status: 'PENDING',
        },
        select: {
          id: true,
          userId: true,
        },
      });

      // Approve all pending payroll items
      await prisma.payrollItem.updateMany({
        where: {
          payrollCycleId,
          status: 'PENDING',
        },
        data: {
          status: 'APPROVED',
        },
      });

      // Link payslip adjustments to approved payroll items
      for (const item of pendingItems) {
        await prisma.payslipAdjustment.updateMany({
          where: {
            userId: item.userId,
            status: 'APPROVED',
            payrollItemId: null, // Not yet linked
            OR: [
              {
                appliedMonth: {
                  gte: cycleWithDates.periodStart,
                  lte: cycleWithDates.periodEnd,
                },
              },
              {
                appliedMonth: null, // Recurring adjustments
              },
            ],
          },
          data: {
            payrollItemId: item.id,
          },
        });
      }

      // Return updated payroll cycle with all items
      return await prisma.payrollCycle.findUnique({
        where: { id: payrollCycleId },
        include: {
          payrollItems: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
              payslipAdjustments: {
                include: {
                  payrollComponent: true,
                },
              },
            },
          },
        },
      });
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
}
