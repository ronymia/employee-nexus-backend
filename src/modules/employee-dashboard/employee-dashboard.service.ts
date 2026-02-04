import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class EmployeeDashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEmployeeDashboard(userId: number) {
    const [
      personalInfo,
      attendanceSummary,
      leaveSummary,
      payrollSummary,
      taskOverview,
      notifications,
    ] = await Promise.all([
      this.getPersonalInfo(userId),
      this.getAttendanceSummary(userId),
      this.getLeaveSummary(userId),
      this.getPayrollSummary(userId),
      this.getTaskOverview(userId),
      this.getNotifications(userId),
    ]);

    return {
      personalInfo,
      attendanceSummary,
      leaveSummary,
      payrollSummary,
      taskOverview,
      notifications,
    };
  }

  private async getPersonalInfo(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        employee: {
          include: {
            departments: {
              where: { isActive: true, isPrimary: true },
              include: { department: true },
            },
            designations: {
              where: { isActive: true },
              include: { designation: true },
            },
          },
        },
      },
    });

    return {
      fullName: user?.profile?.fullName,
      employeeId: user?.employee?.employeeId,
      department: user?.employee?.departments?.at(0)?.department?.name,
      designation: user?.employee?.designations?.at(0)?.designation?.name,
      joiningDate: user?.employee?.joiningDate,
      email: user?.email,
      phone: user?.profile?.phone,
    };
  }

  private async getAttendanceSummary(userId: number) {
    const today = dayjs.utc().startOf('day').toISOString();
    const endToday = dayjs.utc().endOf('day').toISOString();
    const startOfMonth = dayjs.utc().startOf('month').toISOString();
    const endOfMonth = dayjs.utc().endOf('month').toISOString();

    // Today's attendance
    const todayAttendance = await this.prismaService.attendance.findFirst({
      where: {
        userId,
        date: { gte: today, lte: endToday },
      },
      include: {
        punchRecords: true,
      },
    });

    const workingHours =
      todayAttendance?.punchRecords?.[0]?.punchIn &&
      todayAttendance?.punchRecords?.[0]?.punchOut
        ? dayjs(todayAttendance.punchRecords[0].punchOut).diff(
            dayjs(todayAttendance.punchRecords[0].punchIn),
            'hour',
            true,
          )
        : undefined;

    // This month's attendance
    const monthAttendance = await this.prismaService.attendance.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const totalPresent = monthAttendance.filter(
      (a) => a.status === 'approved',
    ).length;
    const totalAbsent = monthAttendance.filter(
      (a) => a.status === 'rejected',
    ).length;
    const totalLate = monthAttendance.filter((a) => a.status === 'late').length;
    const attendanceRate =
      monthAttendance.length > 0
        ? (totalPresent / monthAttendance.length) * 100
        : 0;

    // Recent attendance (last 7 days)
    const recentAttendance = await this.prismaService.attendance.findMany({
      where: {
        userId,
        date: {
          gte: dayjs.utc().subtract(7, 'day').startOf('day').toISOString(),
        },
      },

      orderBy: { date: 'desc' },
      take: 7,
      include: {
        punchRecords: true,
      },
    });

    return {
      today: {
        status: todayAttendance?.status || 'not_punched_in',
        checkInTime: todayAttendance?.punchRecords?.[0]?.punchIn || undefined,
        checkOutTime: todayAttendance?.punchRecords?.[0]?.punchOut || undefined,
        workingHours,
      },
      thisMonth: {
        totalPresent,
        totalAbsent,
        totalLate,
        attendanceRate,
      },
      recentAttendance: recentAttendance.map((a) => ({
        date: a.date,
        status: a.status,
        checkInTime: a.punchRecords?.[0]?.punchIn || undefined,
        checkOutTime: a.punchRecords?.[0]?.punchOut || undefined,
      })),
    };
  }

  private async getLeaveSummary(userId: number) {
    const startOfYear = dayjs.utc().startOf('year').toISOString();
    const today = dayjs.utc().startOf('day').toISOString();

    // Get leave balances
    const employmentStatuses =
      await this.prismaService.employmentStatus.findMany({
        where: {
          employees: {
            some: {
              userId,
            },
          },
        },
        include: {
          leaveTypes: {
            include: {
              leaveType: true,
            },
          },
        },
      });

    // Get leave types for the user's employment status
    const leaveTypes = employmentStatuses.flatMap((es) =>
      es.leaveTypes.map((lt) => lt.leaveType),
    );

    // Calculate leave balances for each leave type
    const leaveBalancePromises = leaveTypes.map(async (leaveType) => {
      // Get approved leaves for this leave type in current year
      const usedRecord = await this.prismaService.leave.aggregate({
        where: {
          userId,
          leaveTypeId: leaveType.id,
          status: 'approved',
          leaveYear: dayjs.utc().year(),
        },
        _sum: {
          totalMinutes: true,
        },
      });
      // Calculate total days used
      const used = usedRecord?._sum.totalMinutes || 0;

      const total = leaveType.leaveMinutes || 0;
      const remaining = total - used;

      return {
        leaveType: leaveType.name,
        total,
        used,
        remaining: Math.max(0, remaining),
      };
    });

    const availableLeaves = await Promise.all(leaveBalancePromises);

    // Upcoming leaves
    const upcomingLeaves = await this.prismaService.leave.findMany({
      where: {
        userId,
        status: 'approved',
        startDate: { gte: today },
      },
      include: { leaveType: true },
      orderBy: { startDate: 'asc' },
      take: 5,
    });

    // Leave history
    const leaveHistory = await this.prismaService.leave.findMany({
      where: {
        userId,
        startDate: { gte: startOfYear },
      },
      include: { leaveType: true },
      orderBy: { startDate: 'desc' },
      take: 10,
    });

    return {
      availableLeaves,
      upcomingLeaves: upcomingLeaves.map((leave) => ({
        leaveType: leave.leaveType.name,
        startDate: leave.startDate,
        endDate: leave?.endDate ? leave.endDate : null,
        status: leave.status,
      })),
      leaveHistory: leaveHistory.map((leave) => ({
        leaveType: leave.leaveType.name,
        startDate: leave.startDate,
        endDate: leave?.endDate ? leave.endDate : null,
        status: leave.status,
        reason: leave.remarks || undefined,
      })),
    };
  }

  private async getPayrollSummary(userId: number) {
    const startOfMonth = dayjs.utc().startOf('month').toISOString();
    const endOfMonth = dayjs.utc().endOf('month').toISOString();
    const startOfYear = dayjs.utc().startOf('year').toISOString();

    // Current month payroll
    const currentMonthPayroll = await this.prismaService.payrollItem.findFirst({
      where: {
        userId,
        paidAt: { gte: startOfMonth, lte: endOfMonth },
      },
      orderBy: { paidAt: 'desc' },
    });

    // Last payment
    const lastPayment = await this.prismaService.payrollItem.findFirst({
      where: {
        userId,
        status: 'PAID',
      },
      orderBy: { paidAt: 'desc' },
    });

    // Year to date
    const yearToDatePayrolls = await this.prismaService.payrollItem.findMany({
      where: {
        userId,
        paidAt: { gte: startOfYear },
        status: 'PAID',
      },
    });

    const totalGrossPay = yearToDatePayrolls.reduce(
      (sum, p) => sum + (p.grossPay || 0),
      0,
    );
    const totalDeductions = yearToDatePayrolls.reduce(
      (sum, p) => sum + (p.totalDeductions || 0),
      0,
    );
    const totalNetPay = yearToDatePayrolls.reduce(
      (sum, p) => sum + (p.netPay || 0),
      0,
    );

    return {
      currentMonth: {
        grossPay: currentMonthPayroll?.grossPay || 0,
        totalDeductions: currentMonthPayroll?.totalDeductions || 0,
        netPay: currentMonthPayroll?.netPay || 0,
        status: currentMonthPayroll?.status || 'PENDING',
      },
      lastPayment: {
        month: lastPayment?.paidAt
          ? dayjs(lastPayment.paidAt).format('MMMM YYYY')
          : 'N/A',
        grossPay: lastPayment?.grossPay || 0,
        netPay: lastPayment?.netPay || 0,
        paidDate: lastPayment?.paidAt || null,
      },
      yearToDate: {
        totalGrossPay,
        totalDeductions,
        totalNetPay,
      },
    };
  }

  private getTaskOverview(userId: number) {
    console.log({ userId });
    // const today = dayjs.utc().startOf('day').toISOString();

    // const [assigned, inProgress, completed, overdue, recentTasks] =
    //   await Promise.all([
    //     this.prismaService.task.count({
    //       where: { assigneeId: userId },
    //     }),
    //     this.prismaService.task.count({
    //       where: { assigneeId: userId, status: 'IN_PROGRESS' },
    //     }),
    //     this.prismaService.task.count({
    //       where: { assigneeId: userId, status: 'COMPLETED' },
    //     }),
    //     this.prismaService.task.count({
    //       where: {
    //         assigneeId: userId,
    //         dueDate: { lt: today },
    //         status: { notIn: ['COMPLETED', 'CANCELLED'] },
    //       },
    //     }),
    //     this.prismaService.task.findMany({
    //       where: { assigneeId: userId },
    //       include: { project: true },
    //       orderBy: { createdAt: 'desc' },
    //       take: 5,
    //     }),
    //   ]);
    const recentTasks = [];
    return {
      assigned: 40,
      inProgress: 20,
      completed: 20,
      overdue: 10,
      recentTasks: recentTasks.map(() => ({
        title: '',
        project: 'Employee Management System',
        status: 'IN_PROGRESS',
        dueDate: dayjs.utc().toISOString(),
        priority: 'MEDIUM',
      })),
    };
  }

  private async getNotifications(userId: number) {
    const [unread, recent] = await Promise.all([
      this.prismaService.notification.count({
        where: { userId, readAt: null },
      }),
      this.prismaService.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      unread,
      recent: recent.map((notification) => ({
        type: notification.type,
        message: notification.message,
        timestamp: notification.createdAt,
        readAt: notification.readAt || null,
      })),
    };
  }
}
