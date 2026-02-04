/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayrollComponentsService } from '../payroll-components/payroll-components.service';
import { PayrollCyclesService } from '../payroll-cycles/payroll-cycles.service';
import { PayrollItemAsPaidInput, QueryPayrollItemInput } from './dto';
import { PayrollItemStatus } from './enums';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class PayrollItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payrollComponentsService: PayrollComponentsService,
    @Inject(forwardRef(() => PayrollCyclesService))
    private readonly payrollCyclesService: PayrollCyclesService,
  ) {}

  /**
   * Calculate working days based on employee's work schedule
   */
  private calculateWorkingDaysFromSchedule(
    periodStart: Date,
    periodEnd: Date,
    schedules: any[],
  ): number {
    if (!schedules || schedules.length === 0) {
      // If no schedule, assume Monday to Friday (5 days a week)
      return this.calculateWorkingDays(periodStart, periodEnd);
    }

    let workingDays = 0;
    const current = new Date(periodStart);

    while (current <= periodEnd) {
      const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Check if this day is a working day in the schedule
      const daySchedule = schedules.find((s) => {
        const scheduleDayMap = {
          SUNDAY: 0,
          MONDAY: 1,
          TUESDAY: 2,
          WEDNESDAY: 3,
          THURSDAY: 4,
          FRIDAY: 5,
          SATURDAY: 6,
        };
        return scheduleDayMap[s.dayOfWeek] === dayOfWeek;
      });

      if (daySchedule && !daySchedule.isWeekend) {
        workingDays++;
      }

      current.setDate(current.getDate() + 1);
    }

    return workingDays;
  }

  // Calculate working days
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

  async createPayrollItem({
    user,
    userId,
    payrollCycleId,
  }: {
    user: JwtPayload;
    userId: number;
    payrollCycleId: number;
  }) {
    const businessId = user.businessId;
    const overtimeRate = 70; // Example overtime rate per hour

    // Verify user belongs to business
    const targetUser = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
        AND: {
          businessId,
        },
      },
      select: {
        id: true,
        employee: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!targetUser.employee) {
      throw new Error('User is not an employee');
    }

    // Get payroll cycle details
    const payrollCycle = await this.prisma.payrollCycle.findUniqueOrThrow({
      where: {
        id: payrollCycleId,
        AND: {
          businessId,
        },
      },
      select: {
        id: true,
        name: true,
        frequency: true,
        periodStart: true,
        periodEnd: true,
        paymentDate: true,
      },
    });

    const { periodStart, periodEnd } = payrollCycle;

    // 1. Get active employee salary
    const activeSalary = await this.prisma.employeeSalary.findFirst({
      where: {
        userId,
        isActive: true,
      },
      select: {
        salaryAmount: true,
        salaryType: true,
      },
    });

    if (!activeSalary) {
      throw new Error('No active salary found for employee');
    }

    const basicSalary = activeSalary.salaryAmount;

    // 5. Get employee active work schedule to calculate total working days
    const activeSchedule = await this.prisma.employeeSchedule.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        workSchedule: {
          include: {
            schedules: true,
          },
        },
      },
    });

    // Calculate working days based on schedule
    const workingDays = this.calculateWorkingDaysFromSchedule(
      periodStart,
      periodEnd,
      activeSchedule?.workSchedule?.schedules || [],
    );

    // 2. Get approved attendances only (present, late, half_day)
    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: {
          in: ['present', 'late', 'half_day', 'approved'],
        },
      },
      select: {
        _count: true,
        status: true,
        overtimeMinutes: true,
      },
    });

    // Calculate present days
    const presentDays = attendances.length;
    let totalOvertimeMinutes = 0;

    for (const attendance of attendances) {
      // 6. Calculate overtime
      if (attendance.overtimeMinutes) {
        totalOvertimeMinutes += attendance.overtimeMinutes;
      }
    }

    // 3. Get absent days from attendance table
    const absentCount = await this.prisma.attendance.count({
      where: {
        userId,
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: 'absent',
      },
    });

    const absentDays = absentCount;

    // 4. Get approved leaves only
    const approvedLeaves = await this.prisma.leave.findMany({
      where: {
        userId,
        status: 'approved',
        OR: [
          {
            startDate: {
              gte: periodStart,
              lte: periodEnd,
            },
          },
          {
            endDate: {
              gte: periodStart,
              lte: periodEnd,
            },
          },
          {
            AND: [
              { startDate: { lte: periodStart } },
              { endDate: { gte: periodEnd } },
            ],
          },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
        totalMinutes: true,
      },
    });

    // Calculate total leave days
    const leaveDays = approvedLeaves.length;

    // 7. Get employee active payroll components
    const activePayrollComponents =
      await this.prisma.employeePayrollComponent.findMany({
        where: {
          userId,
          effectiveFrom: {
            lte: periodEnd,
          },
          OR: [
            { effectiveTo: null },
            {
              effectiveTo: {
                gte: periodStart,
              },
            },
          ],
        },
        include: {
          payrollComponent: true,
        },
      });

    // Calculate earnings and deductions from payroll components
    let earnings = 0;
    let deductions = 0;

    for (const empComponent of activePayrollComponents) {
      const component = empComponent.payrollComponent;
      const componentValue = empComponent.value ?? component.defaultValue ?? 0;

      let calculatedAmount = 0;

      // Calculate based on calculation type
      switch (component.calculationType) {
        case 'FIXED_AMOUNT':
          calculatedAmount = componentValue;
          break;

        case 'PERCENTAGE_OF_BASIC':
          calculatedAmount = (basicSalary * componentValue) / 100;
          break;

        // case 'PERCENTAGE_OF_GROSS':
        //   // Calculate based on attendance ratio
        //   const attendanceRatio = presentDays / (workingDays || 1);
        //   const adjustedBasicSalary = basicSalary * attendanceRatio;
        //   calculatedAmount = (adjustedBasicSalary * componentValue) / 100;
        //   break;

        default:
          calculatedAmount = componentValue;
      }

      if (component.componentType === 'EARNING') {
        earnings += calculatedAmount;
      } else if (component.componentType === 'DEDUCTION') {
        deductions += calculatedAmount;
      }
    }

    // 8. Get employee active payroll adjustments
    const activeAdjustments = await this.prisma.payslipAdjustment.findMany({
      where: {
        userId,
        status: 'APPROVED',
        OR: [
          {
            appliedMonth: {
              gte: periodStart,
              lte: periodEnd,
            },
          },
          {
            appliedMonth: null, // Recurring adjustments
          },
        ],
      },
      include: {
        payrollComponent: true,
      },
    });

    // Calculate adjustment totals
    let adjustmentEarnings = 0;
    let adjustmentDeductions = 0;

    for (const adjustment of activeAdjustments) {
      if (adjustment.payrollComponent?.componentType === 'EARNING') {
        adjustmentEarnings += adjustment.value;
      } else if (adjustment.payrollComponent?.componentType === 'DEDUCTION') {
        adjustmentDeductions += adjustment.value;
      }
    }

    // Calculate final payroll values
    const overtimePay = (totalOvertimeMinutes / 60) * overtimeRate;
    // const attendanceRatio = presentDays / (workingDays || 1);
    // const proRatedBasicSalary = basicSalary * attendanceRatio;

    const grossPay = basicSalary + earnings + adjustmentEarnings + overtimePay;
    const totalDeductions = deductions + adjustmentDeductions;
    const netPay = grossPay - totalDeductions;

    // Create or update payroll item
    const existingPayrollItem = await this.prisma.payrollItem.findUnique({
      where: {
        payrollCycleId_userId: {
          payrollCycleId,
          userId,
        },
      },
    });

    let payrollItem;

    if (existingPayrollItem) {
      // Update existing payroll item in transaction
      payrollItem = await this.prisma.$transaction(async (prisma) => {
        // Delete existing components to re-create them
        await prisma.payrollItemComponent.deleteMany({
          where: { payrollItemId: existingPayrollItem.id },
        });

        // Update payroll item
        const updated = await prisma.payrollItem.update({
          where: {
            id: existingPayrollItem.id,
          },
          data: {
            basicSalary: basicSalary,
            grossPay,
            totalDeductions,
            netPay,
            workingDays,
            presentDays,
            absentDays,
            leaveDays,
            overtimeMinutes: totalOvertimeMinutes,
            status: PayrollItemStatus.PENDING,
          },
          include: {
            user: {
              include: {
                profile: true,
                employee: {
                  include: {
                    designations: {
                      where: { isActive: true },
                      include: { designation: true },
                    },
                    departments: {
                      where: { isActive: true },
                      include: { department: true },
                    },
                  },
                },
              },
            },
            payrollCycle: true,
          },
        });

        // Create PayrollItemComponents snapshot
        if (activePayrollComponents.length > 0) {
          await prisma.payrollItemComponent.createMany({
            data: activePayrollComponents.map((empComponent) => {
              const component = empComponent.payrollComponent;
              const componentValue =
                empComponent.value ?? component.defaultValue ?? 0;

              let calculatedAmount = 0;
              if (component.calculationType === 'FIXED_AMOUNT') {
                calculatedAmount = componentValue;
              } else if (component.calculationType === 'PERCENTAGE_OF_BASIC') {
                calculatedAmount = (basicSalary * componentValue) / 100;
              } else {
                calculatedAmount = componentValue;
              }

              return {
                payrollItemId: updated.id,
                payrollComponentId: component.id,
                componentType: component.componentType,
                calculationType: component.calculationType,
                value: componentValue,
                calculatedAmount,
              };
            }),
          });
        }

        return updated;
      });
    } else {
      // Create new payroll item in transaction
      payrollItem = await this.prisma.$transaction(async (prisma) => {
        const created = await prisma.payrollItem.create({
          data: {
            payrollCycleId,
            userId,
            basicSalary: basicSalary,
            grossPay,
            totalDeductions,
            netPay,
            workingDays,
            presentDays,
            absentDays,
            leaveDays,
            overtimeMinutes: totalOvertimeMinutes,
            status: PayrollItemStatus.PENDING,
            paymentMethod: 'BANK_TRANSFER', // Default payment method
          },
          include: {
            user: {
              include: {
                profile: true,
                employee: {
                  include: {
                    designations: {
                      where: { isActive: true },
                      include: { designation: true },
                    },
                    departments: {
                      where: { isActive: true },
                      include: { department: true },
                    },
                  },
                },
              },
            },
            payrollCycle: true,
          },
        });

        // Create PayrollItemComponents snapshot
        if (activePayrollComponents.length > 0) {
          await prisma.payrollItemComponent.createMany({
            data: activePayrollComponents.map((empComponent) => {
              const component = empComponent.payrollComponent;
              const componentValue =
                empComponent.value ?? component.defaultValue ?? 0;

              let calculatedAmount = 0;
              if (component.calculationType === 'FIXED_AMOUNT') {
                calculatedAmount = componentValue;
              } else if (component.calculationType === 'PERCENTAGE_OF_BASIC') {
                calculatedAmount = (basicSalary * componentValue) / 100;
              } else {
                calculatedAmount = componentValue;
              }

              return {
                payrollItemId: created.id,
                payrollComponentId: component.id,
                componentType: component.componentType,
                calculationType: component.calculationType,
                value: componentValue,
                calculatedAmount,
              };
            }),
          });
        }

        return created;
      });
    }

    // Update payroll cycle totals
    const cycleAggregates = await this.prisma.payrollItem.aggregate({
      where: {
        payrollCycleId,
      },
      _sum: {
        grossPay: true,
        totalDeductions: true,
        netPay: true,
      },
      _count: {
        id: true,
      },
    });

    await this.prisma.payrollCycle.update({
      where: {
        id: payrollCycleId,
      },
      data: {
        totalGrossPay: cycleAggregates._sum.grossPay || 0,
        totalDeductions: cycleAggregates._sum.totalDeductions || 0,
        totalNetPay: cycleAggregates._sum.netPay || 0,
        totalEmployees: cycleAggregates._count.id || 0,
      },
    });

    return payrollItem;
  }

  async previewPayrollItem({
    user,
    userId,
    payrollCycleId,
  }: {
    user: JwtPayload;
    userId: number;
    payrollCycleId: number;
  }) {
    const businessId = user.businessId;
    const overtimeRate = 70; // Example overtime rate per hour

    // Verify user belongs to business
    const targetUser = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
        AND: {
          businessId,
        },
      },
      select: {
        id: true,
        employee: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!targetUser.employee) {
      throw new Error('User is not an employee');
    }

    // Get payroll cycle details
    const payrollCycle = await this.prisma.payrollCycle.findUniqueOrThrow({
      where: {
        id: payrollCycleId,
        AND: {
          businessId,
        },
      },
      select: {
        id: true,
        name: true,
        frequency: true,
        periodStart: true,
        periodEnd: true,
        paymentDate: true,
      },
    });

    const { periodStart, periodEnd } = payrollCycle;

    // 1. Get active employee salary
    const activeSalary = await this.prisma.employeeSalary.findFirst({
      where: {
        userId,
        isActive: true,
      },
      select: {
        salaryAmount: true,
        salaryType: true,
      },
    });

    if (!activeSalary) {
      throw new Error('No active salary found for employee');
    }

    const basicSalary = activeSalary.salaryAmount;

    // 5. Get employee active work schedule to calculate total working days
    const activeSchedule = await this.prisma.employeeSchedule.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        workSchedule: {
          include: {
            schedules: true,
          },
        },
      },
    });

    // Calculate working days based on schedule
    const workingDays = this.calculateWorkingDaysFromSchedule(
      periodStart,
      periodEnd,
      activeSchedule?.workSchedule?.schedules || [],
    );

    // 2. Get approved attendances only (present, late, half_day)
    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: {
          in: ['present', 'late', 'half_day', 'approved'],
        },
      },
      select: {
        _count: true,
        status: true,
        overtimeMinutes: true,
      },
    });

    // Calculate present days
    const presentDays = attendances.length;
    let totalOvertimeMinutes = 0;

    for (const attendance of attendances) {
      // 6. Calculate overtime
      if (attendance.overtimeMinutes) {
        totalOvertimeMinutes += attendance.overtimeMinutes;
      }
    }

    // 3. Get absent days from attendance table
    const absentCount = await this.prisma.attendance.count({
      where: {
        userId,
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: 'absent',
      },
    });

    const absentDays = absentCount;

    // 4. Get approved leaves only
    const approvedLeaves = await this.prisma.leave.findMany({
      where: {
        userId,
        status: 'approved',
        OR: [
          {
            startDate: {
              gte: periodStart,
              lte: periodEnd,
            },
          },
          {
            endDate: {
              gte: periodStart,
              lte: periodEnd,
            },
          },
          {
            AND: [
              { startDate: { lte: periodStart } },
              { endDate: { gte: periodEnd } },
            ],
          },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
        totalMinutes: true,
      },
    });

    // Calculate total leave days
    const leaveDays = approvedLeaves.length;

    // 7. Get employee active payroll components
    const activePayrollComponents =
      await this.prisma.employeePayrollComponent.findMany({
        where: {
          userId,
          effectiveFrom: {
            lte: periodEnd,
          },
          OR: [
            { effectiveTo: null },
            {
              effectiveTo: {
                gte: periodStart,
              },
            },
          ],
        },
        include: {
          payrollComponent: true,
        },
      });

    // Calculate earnings and deductions from payroll components
    let earnings = 0;
    let deductions = 0;

    for (const empComponent of activePayrollComponents) {
      const component = empComponent.payrollComponent;
      const componentValue = empComponent.value ?? component.defaultValue ?? 0;

      let calculatedAmount = 0;

      // Calculate based on calculation type
      switch (component.calculationType) {
        case 'FIXED_AMOUNT':
          calculatedAmount = componentValue;
          break;

        case 'PERCENTAGE_OF_BASIC':
          calculatedAmount = (basicSalary * componentValue) / 100;
          break;

        // case 'PERCENTAGE_OF_GROSS':
        //   // Calculate based on attendance ratio
        //   const attendanceRatio = presentDays / (workingDays || 1);
        //   const adjustedBasicSalary = basicSalary * attendanceRatio;
        //   calculatedAmount = (adjustedBasicSalary * componentValue) / 100;
        //   break;

        default:
          calculatedAmount = componentValue;
      }

      if (component.componentType === 'EARNING') {
        earnings += calculatedAmount;
      } else if (component.componentType === 'DEDUCTION') {
        deductions += calculatedAmount;
      }
    }

    // 8. Get employee active payroll adjustments
    const activeAdjustments = await this.prisma.payslipAdjustment.findMany({
      where: {
        userId,
        status: 'APPROVED',
        OR: [
          {
            appliedMonth: {
              gte: periodStart,
              lte: periodEnd,
            },
          },
          {
            appliedMonth: null, // Recurring adjustments
          },
        ],
      },
      include: {
        payrollComponent: true,
      },
    });

    // Calculate adjustment totals
    let adjustmentEarnings = 0;
    let adjustmentDeductions = 0;

    for (const adjustment of activeAdjustments) {
      if (adjustment.payrollComponent?.componentType === 'EARNING') {
        adjustmentEarnings += adjustment.value;
      } else if (adjustment.payrollComponent?.componentType === 'DEDUCTION') {
        adjustmentDeductions += adjustment.value;
      }
    }

    // Calculate final payroll values
    const overtimePay = (totalOvertimeMinutes / 60) * overtimeRate;
    // const attendanceRatio = presentDays / (workingDays || 1);
    // const proRatedBasicSalary = basicSalary * attendanceRatio;

    const grossPay = basicSalary + earnings + adjustmentEarnings + overtimePay;
    const totalDeductions = deductions + adjustmentDeductions;
    const netPay = grossPay - totalDeductions;

    // Return preview data (no database changes)
    return {
      userId,
      payrollCycleId,
      basicSalary,
      grossPay,
      totalDeductions,
      netPay,
      workingDays,
      presentDays,
      absentDays,
      leaveDays,
      overtimeMinutes: totalOvertimeMinutes,
      overtimePay,
      earnings,
      deductions,
      adjustmentEarnings,
      adjustmentDeductions,
      payrollCycle,
      payrollComponents: activePayrollComponents,
      payrollAdjustments: activeAdjustments,
    };
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
        payrollCycle: true,
        payslipAdjustments: {
          include: {
            payrollComponent: true,
          },
        },
        payrollItemComponents: {
          include: {
            payrollComponent: true,
          },
        },
        user: {
          include: {
            profile: true,
            employee: {
              include: {
                designations: {
                  where: { isActive: true },
                  include: { designation: true },
                },
                departments: {
                  where: { isActive: true },
                  include: { department: true },
                },
                employmentStatuses: {
                  where: { isActive: true },
                  include: { employmentStatus: true },
                },
                workSchedules: {
                  where: { isActive: true },
                  include: { workSchedule: true },
                },
                workSites: {
                  where: { isActive: true },
                  include: {
                    workSite: true,
                  },
                },
              },
            },
            business: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.payrollItem.findUnique({
      where: { id },
      include: {
        payrollCycle: true,
        payslipAdjustments: {
          include: {
            payrollComponent: true,
          },
        },
        payrollItemComponents: {
          include: {
            payrollComponent: true,
          },
        },
        user: {
          include: {
            profile: true,
            employee: {
              include: {
                designations: {
                  where: { isActive: true },
                  include: { designation: true },
                },
                departments: {
                  where: { isActive: true },
                  include: { department: true },
                },
              },
            },
          },
        },
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
    });
  }

  async approve(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      // Get payroll item with cycle details
      const payrollItem = await prisma.payrollItem.findUniqueOrThrow({
        where: { id },
        include: {
          payrollCycle: {
            select: {
              periodStart: true,
              periodEnd: true,
            },
          },
        },
      });

      // Approve the payroll item
      const approvedItem = await prisma.payrollItem.update({
        where: { id },
        data: {
          status: PayrollItemStatus.APPROVED,
        },
      });

      // Link payslip adjustments to this payroll item
      await prisma.payslipAdjustment.updateMany({
        where: {
          userId: payrollItem.userId,
          status: 'APPROVED',
          payrollItemId: null, // Not yet linked
          OR: [
            {
              appliedMonth: {
                gte: payrollItem.payrollCycle.periodStart,
                lte: payrollItem.payrollCycle.periodEnd,
              },
            },
            {
              appliedMonth: null, // Recurring adjustments
            },
          ],
        },
        data: {
          payrollItemId: id,
        },
      });

      return approvedItem;
    });
  }

  async markAsPaid(input: PayrollItemAsPaidInput) {
    // Check if payroll cycle is approved
    const payrollCycle = await this.prisma.payrollCycle.findUniqueOrThrow({
      where: { id: input.payrollCycleId },
    });

    if (payrollCycle.status !== 'APPROVED') {
      throw new Error(
        'Payroll cycle must be approved before marking items as paid',
      );
    }

    // Verify the payroll item belongs to the cycle
    const payrollItem = await this.prisma.payrollItem.findUniqueOrThrow({
      where: { id: input.id },
    });

    if (payrollItem.payrollCycleId !== payrollCycle.id) {
      throw new Error('Payroll item does not belong to the specified cycle');
    }

    // Mark the payroll item as paid
    return this.prisma.payrollItem.update({
      where: { id: input.id },
      data: {
        status: PayrollItemStatus.PAID,
        paymentMethod: input.paymentMethod,
        transactionRef: input.transactionRef,
        paidAt: new Date().toUTCString(),
      },
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

      const payrollCycleId = payrollItem.payrollCycleId;

      // Delete the payroll item
      await prisma.payrollItem.delete({
        where: { id },
      });

      // Update payroll cycle totals after deletion
      const cycleAggregates = await prisma.payrollItem.aggregate({
        where: {
          payrollCycleId,
        },
        _sum: {
          grossPay: true,
          totalDeductions: true,
          netPay: true,
        },
        _count: {
          id: true,
        },
      });

      await prisma.payrollCycle.update({
        where: {
          id: payrollCycleId,
        },
        data: {
          totalGrossPay: cycleAggregates._sum.grossPay || 0,
          totalDeductions: cycleAggregates._sum.totalDeductions || 0,
          totalNetPay: cycleAggregates._sum.netPay || 0,
          totalEmployees: cycleAggregates._count.id || 0,
        },
      });

      return { id, deleted: true };
    });
  }
}
