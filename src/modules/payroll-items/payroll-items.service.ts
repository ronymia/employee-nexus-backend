/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayrollComponentsService } from '../payroll-components/payroll-components.service';
import { PayrollCyclesService } from '../payroll-cycles/payroll-cycles.service';
import {
  CreatePayrollItemInput,
  UpdatePayrollItemInput,
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

  async create(
    user: JwtPayload,
    createPayrollItemInput: CreatePayrollItemInput,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // Calculate gross pay, deductions, and net pay
      const calculations = await this.calculatePayrollItem(
        createPayrollItemInput,
      );
      // Create the payroll item
      const payrollItem = await prisma.payrollItem.create({
        data: {
          payrollCycleId: createPayrollItemInput.payrollCycleId,
          userId: createPayrollItemInput.userId,
          basicSalary: createPayrollItemInput.basicSalary,
          grossPay: calculations.grossPay,
          totalDeductions: calculations.totalDeductions,
          netPay: calculations.netPay,
          workingDays: createPayrollItemInput.workingDays,
          presentDays: createPayrollItemInput.presentDays,
          absentDays: createPayrollItemInput.absentDays,
          leaveDays: createPayrollItemInput.leaveDays,
          overtimeHours: createPayrollItemInput.overtimeHours,
          notes: createPayrollItemInput.notes,
          status: PayrollItemStatus.PENDING,
          paymentMethod: createPayrollItemInput.paymentMethod,
        },
      });

      // Create payroll item components if provided
      if (
        createPayrollItemInput.components &&
        createPayrollItemInput.components.length > 0
      ) {
        await prisma.payrollItemComponent.createMany({
          data: createPayrollItemInput.components.map((comp) => ({
            payrollItemId: payrollItem.id,
            componentId: comp.componentId,
            amount: comp.amount,
            calculationBase: comp.calculationBase,
            notes: comp.notes,
          })),
        });
      }

      // Create payslip adjustments if provided
      if (
        createPayrollItemInput.adjustments &&
        createPayrollItemInput.adjustments.length > 0
      ) {
        await prisma.payslipAdjustment.createMany({
          data: createPayrollItemInput.adjustments.map((adj) => ({
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
        if (createPayrollItemInput.adjustments.length > 0) {
          const adjustmentTotal = createPayrollItemInput.adjustments.reduce(
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
      await this.payrollCyclesService.updateTotals(
        createPayrollItemInput.payrollCycleId,
      );

      return await this.findOne(payrollItem.id);
    });
  }

  async findAll(query: QueryPayrollItemInput) {
    if (query?.payrollCycleId) {
      const payrollCycle = await this.payrollCyclesService.findOne(
        query.payrollCycleId,
      );
      if (!payrollCycle) {
        throw new Error('Payroll cycle not found');
      }
    }

    const whereCondition: any = {};

    if (query?.userId) {
      whereCondition.userId = query.userId;
    }

    if (query?.status) {
      whereCondition.status = query.status;
    }

    if (query?.payrollCycleId) {
      whereCondition.payrollCycleId = query.payrollCycleId;
    }

    return await this.prisma.payrollItem.findMany({
      where: whereCondition,
      include: {
        user: {
          include: {
            profile: true,
            employee: {
              include: {
                designation: true,
                department: true,
                employmentStatus: true,
                workSchedule: true,
                workSite: true,
              },
            },
            business: true,
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
        paymentMethod: '',
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

  async update(
    user: JwtPayload,
    updatePayrollItemInput: UpdatePayrollItemInput,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // Get existing payroll item
      const existingItem = await prisma.payrollItem.findUnique({
        where: { id: updatePayrollItemInput.id },
        include: {
          components: true,
          adjustments: true,
        },
      });

      if (!existingItem) {
        throw new Error('Payroll item not found');
      }

      // Check if payroll item can be updated (must be in PENDING or DRAFT status)
      if (!['PENDING', 'DRAFT'].includes(existingItem.status)) {
        throw new Error(
          'Cannot update payroll item that is already approved or paid',
        );
      }

      // Prepare update data
      const updateData: any = {};
      if (updatePayrollItemInput.basicSalary !== undefined) {
        updateData.basicSalary = updatePayrollItemInput.basicSalary;
      }
      if (updatePayrollItemInput.workingDays !== undefined) {
        updateData.workingDays = updatePayrollItemInput.workingDays;
      }
      if (updatePayrollItemInput.presentDays !== undefined) {
        updateData.presentDays = updatePayrollItemInput.presentDays;
      }
      if (updatePayrollItemInput.absentDays !== undefined) {
        updateData.absentDays = updatePayrollItemInput.absentDays;
      }
      if (updatePayrollItemInput.leaveDays !== undefined) {
        updateData.leaveDays = updatePayrollItemInput.leaveDays;
      }
      if (updatePayrollItemInput.overtimeHours !== undefined) {
        updateData.overtimeHours = updatePayrollItemInput.overtimeHours;
      }
      if (updatePayrollItemInput.notes !== undefined) {
        updateData.notes = updatePayrollItemInput.notes;
      }
      if (updatePayrollItemInput.paymentMethod !== undefined) {
        updateData.paymentMethod = updatePayrollItemInput.paymentMethod;
      }
      if (updatePayrollItemInput.bankAccount !== undefined) {
        updateData.bankAccount = updatePayrollItemInput.bankAccount;
      }
      if (updatePayrollItemInput.transactionRef !== undefined) {
        updateData.transactionRef = updatePayrollItemInput.transactionRef;
      }

      // Update components if provided
      if (updatePayrollItemInput.components) {
        // Delete existing components
        await prisma.payrollItemComponent.deleteMany({
          where: { payrollItemId: updatePayrollItemInput.id },
        });

        // Create new components
        await prisma.payrollItemComponent.createMany({
          data: updatePayrollItemInput.components.map((comp) => ({
            payrollItemId: updatePayrollItemInput.id,
            componentId: comp.componentId,
            amount: comp.amount,
            calculationBase: comp.calculationBase,
            notes: comp.notes,
          })),
        });
      }

      // Update adjustments if provided
      if (updatePayrollItemInput.adjustments) {
        // Delete existing adjustments
        await prisma.payslipAdjustment.deleteMany({
          where: { payrollItemId: updatePayrollItemInput.id },
        });

        // Create new adjustments
        await prisma.payslipAdjustment.createMany({
          data: updatePayrollItemInput.adjustments.map((adj) => ({
            payrollItemId: updatePayrollItemInput.id,
            type: adj.type,
            description: adj.description,
            amount: adj.amount,
            isRecurring: adj.isRecurring ?? false,
            notes: adj.notes,
            createdBy: user.userId,
          })),
        });
      }

      // Recalculate gross pay, deductions, and net pay if anything affecting calculation changed
      const shouldRecalculate =
        updatePayrollItemInput.basicSalary !== undefined ||
        updatePayrollItemInput.components !== undefined ||
        updatePayrollItemInput.adjustments !== undefined;

      if (shouldRecalculate) {
        // Build the input for calculation with updated values
        const calculationInput = {
          payrollCycleId: existingItem.payrollCycleId,
          userId: existingItem.userId,
          basicSalary:
            updatePayrollItemInput.basicSalary ?? existingItem.basicSalary,
          workingDays:
            updatePayrollItemInput.workingDays ?? existingItem.workingDays,
          presentDays:
            updatePayrollItemInput.presentDays ?? existingItem.presentDays,
          absentDays:
            updatePayrollItemInput.absentDays ?? existingItem.absentDays,
          leaveDays: updatePayrollItemInput.leaveDays ?? existingItem.leaveDays,
          overtimeHours:
            updatePayrollItemInput.overtimeHours ?? existingItem.overtimeHours,
          components: updatePayrollItemInput.components,
          adjustments: updatePayrollItemInput.adjustments,
        };

        const calculations = await this.calculatePayrollItem(
          calculationInput as any,
        );

        updateData.grossPay = calculations.grossPay;
        updateData.totalDeductions = calculations.totalDeductions;
        updateData.netPay = calculations.netPay;
      }

      // Update the payroll item
      const updatedItem = await prisma.payrollItem.update({
        where: { id: updatePayrollItemInput.id },
        data: updateData,
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          payrollCycle: true,
          components: {
            include: {
              component: true,
            },
          },
          adjustments: true,
        },
      });

      return updatedItem;
    });
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      // Get payroll item
      const payrollItem = await prisma.payrollItem.findUnique({
        where: { id },
      });

      if (!payrollItem) {
        throw new Error('Payroll item not found');
      }

      // Check if payroll item can be deleted (must be in PENDING or DRAFT status)
      if (!['PENDING', 'DRAFT'].includes(payrollItem.status)) {
        throw new Error(
          'Cannot delete payroll item that is already approved or paid',
        );
      }

      // Delete related records first
      await prisma.payrollItemComponent.deleteMany({
        where: { payrollItemId: id },
      });

      await prisma.payslipAdjustment.deleteMany({
        where: { payrollItemId: id },
      });

      // Delete the payroll item
      await prisma.payrollItem.delete({
        where: { id },
      });

      // Update cycle totals after deletion
      await this.payrollCyclesService.updateTotals(payrollItem.payrollCycleId);

      return { id, deleted: true };
    });
  }
}
