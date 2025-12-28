import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';

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
              where: { isActive: true },
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
      fullName: user?.profile?.fullName || 'N/A',
      employeeId: user?.employee?.employeeId || 'N/A',
      department: user?.employee?.departments?.[0]?.department?.name || 'N/A',
      designation:
        user?.employee?.designations?.[0]?.designation?.name || 'N/A',
      joiningDate: user?.employee?.joiningDate || new Date(),
      email: user?.email || 'N/A',
      phone: user?.profile?.phone || 'N/A',
    };
  }

  private async getAttendanceSummary(userId: number) {
    const today = dayjs().startOf('day').toDate();
    const endToday = dayjs().endOf('day').toDate();
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

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
          gte: dayjs().subtract(7, 'day').startOf('day').toDate(),
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
    const startOfYear = dayjs().startOf('year').toDate();
    const today = dayjs().startOf('day').toDate();

    // Get leave balances
    // const leaveBalances = await this.prismaService.leaveBalance.findMany({
    //   where: { userId },
    //   include: { leaveType: true },
    // });

    const availableLeaves = [].map(() => ({
      leaveType: 'Sick',
      total: 1,
      used: 10,
      remaining: 50,
    }));

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
        endDate: leave.endDate || new Date(),
        status: leave.status,
      })),
      leaveHistory: leaveHistory.map((leave) => ({
        leaveType: leave.leaveType.name,
        startDate: leave.startDate,
        endDate: leave.endDate || new Date(),
        status: leave.status,
        reason: leave.rejectionReason || undefined,
      })),
    };
  }

  private async getPayrollSummary(userId: number) {
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();
    const startOfYear = dayjs().startOf('year').toDate();

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
        paidDate: lastPayment?.paidAt || new Date(),
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
    // const today = dayjs().startOf('day').toDate();

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
        dueDate: new Date(),
        priority: 'MEDIUM',
      })),
    };
  }

  private async getNotifications(userId: number) {
    const [unread, recent] = await Promise.all([
      this.prismaService.notification.count({
        where: { userId, isRead: false },
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
        isRead: notification.isRead,
      })),
    };
  }
}
