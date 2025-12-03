/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayrollComponentsService } from '../payroll-components/payroll-components.service';
import { PayrollCyclesService } from '../payroll-cycles/payroll-cycles.service';
import {
  CreatePayrollItemInput,
  QueryPayrollItemInput,
  AddPayslipAdjustmentInput,
  GeneratePayrollItemsInput,
} from './dto';
import { PayrollItemStatus } from './enums';
import { CalculationType } from '../payroll-components/enums';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class PayrollItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payrollComponentsService: PayrollComponentsService,
    private readonly payrollCyclesService: PayrollCyclesService,
  ) {}

  async create(user: JwtPayload, input: CreatePayrollItemInput) {
    return this.prisma.$transaction(async (prisma) => {
      // Calculate gross pay, deductions, and net pay
      const calculations = await this.calculatePayrollItem(input);

      // Create the payroll item
      const payrollItem = await prisma.payrollItem.create({
        data: {
          payrollCycleId: input.payrollCycleId,
          userId: input.userId,
          basicSalary: input.basicSalary,
          grossPay: calculations.grossPay,
          totalDeductions: calculations.totalDeductions,
          netPay: calculations.netPay,
          workingDays: input.workingDays,
          presentDays: input.presentDays,
          absentDays: input.absentDays,
          leaveDays: input.leaveDays,
          overtimeHours: input.overtimeHours,
          notes: input.notes,
          status: PayrollItemStatus.PENDING,
        },
      });

      // Create payroll item components if provided
      if (input.components && input.components.length > 0) {
        await prisma.payrollItemComponent.createMany({
          data: input.components.map((comp) => ({
            payrollItemId: payrollItem.id,
            componentId: comp.componentId,
            amount: comp.amount,
            calculationBase: comp.calculationBase,
            notes: comp.notes,
          })),
        });
      }

      // Create payslip adjustments if provided
      if (input.adjustments && input.adjustments.length > 0) {
        await prisma.payslipAdjustment.createMany({
          data: input.adjustments.map((adj) => ({
            payrollItemId: payrollItem.id,
            type: adj.type,
            description: adj.description,
            amount: adj.amount,
            isRecurring: adj.isRecurring ?? false,
            createdBy: user.userId,
            notes: adj.notes,
          })),
        });

        // Recalculate net pay if adjustments were added
        if (input.adjustments.length > 0) {
          const adjustmentTotal = input.adjustments.reduce(
            (sum, adj) => sum + adj.amount,
            0,
          );
          await prisma.payrollItem.update({
            where: { id: payrollItem.id },
            data: {
              netPay: payrollItem.netPay + adjustmentTotal,
            },
          });
        }
      }

      // Update cycle totals
      await this.payrollCyclesService.updateTotals(input.payrollCycleId);

      return await this.findOne(payrollItem.id);
    });
  }

  async findAll(query: QueryPayrollItemInput) {
    return this.prisma.payrollItem.findMany({
      where: {
        payrollCycleId: query.payrollCycleId,
        ...(query.userId && { userId: query.userId }),
        ...(query.status && { status: query.status }),
      },
      include: {
        user: {
          include: {
            profile: true,
            employee: {
              include: {
                designation: true,
                department: true,
              },
            },
          },
        },
        components: {
          include: {
            component: true,
          },
        },
        adjustments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.payrollItem.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
            employee: {
              include: {
                designation: true,
                department: true,
              },
            },
          },
        },
        components: {
          include: {
            component: true,
          },
        },
        adjustments: true,
      },
    });
  }

  async findByUserId(payrollCycleId: number, userId: number) {
    return this.prisma.payrollItem.findUnique({
      where: {
        payrollCycleId_userId: {
          payrollCycleId,
          userId,
        },
      },
      include: {
        components: {
          include: {
            component: true,
          },
        },
        adjustments: true,
      },
    });
  }

  async addAdjustment(user: JwtPayload, input: AddPayslipAdjustmentInput) {
    return this.prisma.$transaction(async (prisma) => {
      // Create adjustment
      const adjustment = await prisma.payslipAdjustment.create({
        data: {
          payrollItemId: input.payrollItemId,
          type: input.type,
          description: input.description,
          amount: input.amount,
          createdBy: user.userId,
        },
      });

      // Recalculate payroll item totals
      const payrollItem = await prisma.payrollItem.findUnique({
        where: { id: input.payrollItemId },
        include: {
          adjustments: true,
        },
      });

      if (payrollItem) {
        const adjustmentTotal = payrollItem.adjustments.reduce(
          (sum, adj) => sum + adj.amount,
          0,
        );

        const newNetPay =
          payrollItem.grossPay - payrollItem.totalDeductions + adjustmentTotal;

        await prisma.payrollItem.update({
          where: { id: input.payrollItemId },
          data: {
            netPay: newNetPay,
          },
        });

        // Update cycle totals
        await this.payrollCyclesService.updateTotals(
          payrollItem.payrollCycleId,
        );
      }

      return adjustment;
    });
  }

  async generatePayrollItems(
    user: JwtPayload,
    input: GeneratePayrollItemsInput,
  ) {
    // Get payroll cycle details
    const cycle = await this.prisma.payrollCycle.findUnique({
      where: { id: input.payrollCycleId },
    });

    if (!cycle) {
      throw new Error('Payroll cycle not found');
    }

    // Get all active employees in the business
    const employees = await this.prisma.employee.findMany({
      where: {
        user: {
          businessId: input.businessId,
          // status: 'ACTIVE',
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Get active payroll components
    const components = await this.payrollComponentsService.findActiveComponents(
      input.businessId,
    );

    const createdItems: any[] = [];

    for (const employee of employees) {
      // Calculate attendance data
      const attendanceData = await this.calculateAttendanceData(
        employee.userId,
        cycle.periodStart,
        cycle.periodEnd,
      );

      // Create payroll item input
      const payrollItemInput: CreatePayrollItemInput = {
        payrollCycleId: input.payrollCycleId,
        userId: employee.userId,
        basicSalary: employee.salaryPerMonth,
        workingDays: attendanceData.workingDays,
        presentDays: attendanceData.presentDays,
        absentDays: attendanceData.absentDays,
        leaveDays: attendanceData.leaveDays,
        overtimeHours: attendanceData.overtimeHours,
        components: await this.calculateComponents(
          employee.salaryPerMonth,
          components,
        ),
      };

      const item = await this.create(user, payrollItemInput);
      createdItems.push(item as any);
    }

    return createdItems;
  }

  async approve(id: number) {
    return this.prisma.payrollItem.update({
      where: { id },
      data: {
        status: PayrollItemStatus.APPROVED,
      },
    });
  }

  async markAsPaid(id: number, paymentMethod: string, transactionRef?: string) {
    return this.prisma.payrollItem.update({
      where: { id },
      data: {
        status: PayrollItemStatus.PAID,
        paymentMethod,
        transactionRef,
        paidAt: new Date(),
      },
    });
  }

  private async calculatePayrollItem(input: CreatePayrollItemInput) {
    let grossPay = input.basicSalary;
    let totalDeductions = 0;

    // Calculate salary based on attendance
    const attendanceRatio = input.presentDays / input.workingDays;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseSalary = input.basicSalary * attendanceRatio;

    // Calculate components
    if (input.components && input.components.length > 0) {
      for (const comp of input.components) {
        const component = await this.payrollComponentsService.findOne(
          comp.componentId,
        );

        if (component) {
          if (component.componentType === 'EARNING') {
            grossPay += comp.amount;
          } else if (component.componentType === 'DEDUCTION') {
            totalDeductions += comp.amount;
          }
        }
      }
    }

    const netPay = grossPay - totalDeductions;

    return {
      grossPay,
      totalDeductions,
      netPay,
    };
  }

  private async calculateAttendanceData(
    userId: number,
    periodStart: Date,
    periodEnd: Date,
  ) {
    // Calculate working days in the period
    const workingDays = this.calculateWorkingDays(periodStart, periodEnd);

    // Get attendance records for the period
    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    });

    let presentDays = 0;
    let absentDays = 0;

    for (const attendance of attendances) {
      if (attendance.status === 'present' || attendance.status === 'late') {
        presentDays += 1;
      } else if (attendance.status === 'absent') {
        absentDays += 1;
      } else if (attendance.status === 'half_day') {
        presentDays += 0.5;
        absentDays += 0.5;
      }
    }

    // Get leave records for the period
    const leaves = await this.prisma.leave.findMany({
      where: {
        userId,
        startDate: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: 'approved',
      },
    });

    const leaveDays = leaves.reduce((sum, leave) => {
      const days =
        (leave.endDate
          ? Math.ceil(
              (leave.endDate.getTime() - leave.startDate.getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1
          : 1) || 1;
      return sum + days;
    }, 0);

    // Calculate overtime hours
    const overtimeHours = await this.calculateOvertimeHours(
      userId,
      periodStart,
      periodEnd,
    );

    return {
      workingDays,
      presentDays,
      absentDays,
      leaveDays,
      overtimeHours,
    };
  }

  private calculateWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      // Exclude weekends (Saturday=6, Sunday=0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  private async calculateOvertimeHours(
    userId: number,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<number> {
    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    });

    let overtimeHours = 0;

    for (const attendance of attendances) {
      if (attendance.totalHours && attendance.totalHours > 8) {
        overtimeHours += attendance.totalHours - 8;
      }
    }

    return overtimeHours;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async calculateComponents(
    basicSalary: number,
    components: any[],
  ): Promise<any[]> {
    const result: any[] = [];

    for (const component of components) {
      let amount = 0;
      let calculationBase = 0;

      switch (component.calculationType) {
        case CalculationType.FIXED_AMOUNT:
          amount = component.defaultValue || 0;
          break;

        case CalculationType.PERCENTAGE_OF_BASIC:
          calculationBase = basicSalary;
          amount = (basicSalary * (component.defaultValue || 0)) / 100;
          break;

        case CalculationType.PERCENTAGE_OF_GROSS:
          // For gross percentage, we'll use basic salary as an approximation
          calculationBase = basicSalary;
          amount = (basicSalary * (component.defaultValue || 0)) / 100;
          break;

        default:
          amount = component.defaultValue || 0;
      }

      result.push({
        componentId: component.id,
        amount,
        calculationBase,
      });
    }

    return result;
  }
}
