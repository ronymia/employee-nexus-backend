import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BusinessOverview,
  AttendanceAnalytics,
  LeaveStats,
  PayrollSummary,
  ProjectOverview,
  RecentActivities,
  RecentActivityItem,
} from './entities/owner-dashboard.entity';
import * as dayjs from 'dayjs';
import { UserAccountStatus } from '../users/enums';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class OwnerDashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOwnerDashboard(businessId: number) {
    // Execute all queries in parallel for better performance
    const [
      businessOverview,
      attendanceAnalytics,
      leaveStats,
      payrollSummary,
      projectOverview,
      recentActivities,
    ] = await Promise.all([
      this.getBusinessOverview(businessId),
      this.getAttendanceAnalytics(businessId),
      this.getLeaveStats(businessId),
      this.getPayrollSummary(businessId),
      this.getProjectOverview(businessId),
      this.getRecentActivities(businessId),
    ]);

    // console.log({ recentProjects: projectOverview.recentProjects });
    return {
      businessOverview,
      attendanceAnalytics,
      leaveStats,
      payrollSummary,
      projectOverview,
      recentActivities,
    };
  }

  private async getBusinessOverview(
    businessId: number,
  ): Promise<BusinessOverview> {
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
      totalProjects,
      activeProjects,
      payrollData,
    ] = await Promise.all([
      this.prismaService.user.count({
        where: {
          businessId,
          AND: {
            role: {
              NOT: { name: `OWNER#${businessId}` },
            },
          },
        },
      }),
      this.prismaService.user.count({
        where: {
          businessId,
          status: UserAccountStatus.ACTIVE,
          AND: {
            role: {
              NOT: { name: `OWNER#${businessId}` },
            },
          },
        },
      }),
      this.prismaService.user.count({
        where: {
          businessId,
          status: UserAccountStatus.INACTIVE,
          AND: {
            role: {
              NOT: { name: `OWNER#${businessId}` },
            },
          },
        },
      }),
      this.prismaService.department.count({ where: { businessId } }),
      this.prismaService.project.count({ where: { businessId } }),
      this.prismaService.project.count({
        where: {
          businessId,
          status: {
            not: 'COMPLETED',
          },
        },
      }),
      this.prismaService.payrollItem.aggregate({
        where: {
          user: { businessId },
          paidAt: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { netPay: true },
      }),
    ]);

    const pendingPayrollData = await this.prismaService.payrollItem.aggregate({
      where: {
        user: { businessId },
        status: 'APPROVED',
        payrollCycle: {
          periodStart: { gte: startOfMonth, lte: endOfMonth },
        },
      },
      _sum: { netPay: true },
    });

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
      totalProjects,
      activeProjects,
      totalMonthlyPayroll: payrollData._sum.netPay || 0,
      pendingPayrollAmount: pendingPayrollData._sum.netPay || 0,
    };
  }

  private async getAttendanceAnalytics(
    businessId: number,
  ): Promise<AttendanceAnalytics> {
    const today = dayjs.utc().startOf('day').toDate();
    const endToday = dayjs().endOf('day').toDate();
    const startOfWeek = dayjs().startOf('week').toDate();
    const endOfWeek = dayjs().endOf('week').toDate();
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    // Today's attendance
    const [todayAttendance, totalEmployees] = await Promise.all([
      this.prismaService.attendance.findMany({
        where: {
          user: { businessId },
          date: { gte: today, lte: endToday },
        },
        select: { status: true },
      }),
      this.prismaService.user.count({
        where: { businessId, status: UserAccountStatus.ACTIVE },
      }),
    ]);

    const todayOnLeave = await this.prismaService.leave.count({
      where: {
        user: { businessId },
        status: 'approved',
        startDate: { lte: endToday },
        OR: [
          { endDate: { gte: today } }, // normal case
          { endDate: null }, // ongoing leave
        ],
      },
    });

    const todayPresent = todayAttendance.filter(
      (a) => a.status === 'approved' || a.status === 'pending',
    ).length;
    const todayAbsent = todayAttendance.filter(
      (a) => a.status === 'rejected',
    ).length;
    const todayLate = todayAttendance.filter((a) => a.status === 'late').length;
    const attendanceOnToday = totalEmployees - (todayOnLeave || 0);
    const notPunchedIn = attendanceOnToday - todayAttendance.length;

    // This week's attendance
    const weekAttendance = await this.prismaService.attendance.groupBy({
      by: ['date'],
      where: {
        user: { businessId },
        date: { gte: startOfWeek, lte: endOfWeek },
      },
      _count: { id: true },
    });

    const totalWorkingDays = weekAttendance.length;
    const totalPresentDays = weekAttendance.filter(
      (d) => d._count.id > 0,
    ).length;
    const averageAttendanceRate =
      totalWorkingDays > 0 ? (totalPresentDays / totalWorkingDays) * 100 : 0;

    // This month's attendance
    const monthAttendance = await this.prismaService.attendance.findMany({
      where: {
        user: { businessId },
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      select: { status: true },
    });

    const monthTotal = monthAttendance.length || 1;
    const monthPresent = monthAttendance.filter(
      (a) => a.status === 'approved' || a.status === 'late',
    ).length;
    const lateArrivals = monthAttendance.filter(
      (a) => a.status === 'late',
    ).length;
    const earlyDepartures = 0; // TODO: Implement early departure logic

    const attendanceRate = (monthPresent / monthTotal) * 100;

    // Trend data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      dayjs().subtract(i, 'day').startOf('day').toDate(),
    ).reverse();

    const trendData = await Promise.all(
      last7Days.map(async (date) => {
        const presentCount = await this.prismaService.attendance.count({
          where: {
            user: { businessId },
            date: {
              gte: date,
              lte: dayjs(date).endOf('day').toDate(),
            },
            status: { in: ['approved', 'late'] },
          },
        });
        return {
          date: dayjs(date).format('YYYY-MM-DD'),
          presentCount,
        };
      }),
    );

    return {
      today: {
        present: todayPresent,
        absent: todayAbsent,
        late: todayLate,
        onLeave: todayOnLeave,
        attendanceOnToday,
        notPunchedIn,
      },
      thisWeek: {
        averageAttendanceRate,
        totalWorkingDays,
        totalPresentDays,
      },
      thisMonth: {
        attendanceRate,
        lateArrivals,
        earlyDepartures,
      },
      trend: trendData,
    };
  }

  // Get leave statistics for the dashboard THIS MONTH
  private async getLeaveStats(businessId: number): Promise<LeaveStats> {
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();
    const today = dayjs().startOf('day').toDate();

    const [pending, approved, rejected, monthLeaves, upcomingLeaves] =
      await Promise.all([
        this.prismaService.leave.count({
          where: { user: { businessId }, status: 'pending' },
        }),
        this.prismaService.leave.count({
          where: { user: { businessId }, status: 'approved' },
        }),
        this.prismaService.leave.count({
          where: { user: { businessId }, status: 'rejected' },
        }),
        this.prismaService.leave.findMany({
          where: {
            user: { businessId },
            startDate: { gte: startOfMonth, lte: endOfMonth },
          },
          include: { leaveType: true },
        }),
        this.prismaService.leave.findMany({
          where: {
            user: { businessId },
            status: 'approved',
            startDate: { gte: today },
          },
          take: 5,
          orderBy: { startDate: 'asc' },
          include: {
            user: { select: { profile: { select: { fullName: true } } } },
            leaveType: true,
          },
        }),
      ]);

    // Group leaves by type
    const leaveByType = monthLeaves.reduce(
      (acc, leave) => {
        const typeName = leave.leaveType?.name;
        const existing = acc.find((item) => item.leaveType === typeName);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ leaveType: typeName, count: 1 });
        }
        return acc;
      },
      [] as Array<{ leaveType: string; count: number }>,
    );

    return {
      pending,
      approved,
      rejected,
      thisMonth: {
        total: monthLeaves.length,
        byType: leaveByType,
      },
      upcomingLeaves: upcomingLeaves.map((leave) => ({
        employeeName: leave?.user?.profile?.fullName as string,
        leaveType: leave.leaveType?.name,
        startDate: leave?.startDate,
        endDate: leave?.endDate ? leave?.endDate : leave?.startDate,
      })),
    };
  }

  private async getPayrollSummary(businessId: number): Promise<PayrollSummary> {
    // Get current cycle (most recent payroll cycle)
    const currentCycle = await this.prismaService.payrollCycle.findFirst({
      where: {
        businessId,
        paymentDate: {
          gte: dayjs().startOf('month').toDate(),
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        payrollItems: {
          select: {
            grossPay: true,
            totalDeductions: true,
            netPay: true,
          },
        },
      },
    });

    // Year to date calculations
    const startOfYear = dayjs().startOf('year').toDate();
    const endOfYear = dayjs().endOf('year').toDate();

    const yearPayrolls = await this.prismaService.payrollCycle.findMany({
      where: {
        businessId,
        periodStart: { gte: startOfYear, lte: endOfYear },
      },
      include: {
        payrollItems: {
          select: { netPay: true },
        },
      },
    });

    const monthlyTotals = yearPayrolls.reduce(
      (acc, cycle) => {
        const month = dayjs(cycle.periodStart).format('MMM');
        const total = cycle.payrollItems.reduce(
          (sum, item) => sum + (item.netPay || 0),
          0,
        );
        acc[month] = (acc[month] || 0) + total;
        return acc;
      },
      {} as Record<string, number>,
    );

    const monthEntries = Object.entries(monthlyTotals);
    const totalPaid = monthEntries.reduce((sum, [, amount]) => sum + amount, 0);
    const averageMonthlyPayroll =
      monthEntries.length > 0 ? totalPaid / monthEntries.length : 0;

    const highestMonth =
      monthEntries.length > 0
        ? monthEntries.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
        : ['N/A', 0];
    const lowestMonth =
      monthEntries.length > 0
        ? monthEntries.reduce((min, curr) => (curr[1] < min[1] ? curr : min))
        : ['N/A', 0];

    // Pending actions
    const [draftCycles, pendingApprovals, pendingPayments] = await Promise.all([
      this.prismaService.payrollCycle.count({
        where: { businessId, status: 'DRAFT' },
      }),
      this.prismaService.payrollCycle.count({
        where: { businessId, status: 'PROCESSING' },
      }),
      this.prismaService.payrollCycle.count({
        where: { businessId, status: 'APPROVED' },
      }),
    ]);

    return {
      currentCycle: {
        name: currentCycle?.name || 'No active cycle',
        status: currentCycle?.status || 'N/A',
        periodStart: currentCycle?.periodStart || new Date(),
        periodEnd: currentCycle?.periodEnd || new Date(),
        paymentDate: currentCycle?.paymentDate || new Date(),
        totalEmployees: currentCycle?.payrollItems.length || 0,
        totalGrossPay:
          currentCycle?.payrollItems.reduce(
            (sum, item) => sum + (item.grossPay || 0),
            0,
          ) || 0,
        totalDeductions:
          currentCycle?.payrollItems.reduce(
            (sum, item) => sum + (item.totalDeductions || 0),
            0,
          ) || 0,
        totalNetPay:
          currentCycle?.payrollItems.reduce(
            (sum, item) => sum + (item.netPay || 0),
            0,
          ) || 0,
      },
      yearToDate: {
        totalPaid,
        averageMonthlyPayroll,
        highestMonth: {
          month: String(highestMonth[0]),
          amount: Number(highestMonth[1]),
        },
        lowestMonth: {
          month: String(lowestMonth[0]),
          amount: Number(lowestMonth[1]),
        },
      },
      pendingActions: {
        draftCycles,
        pendingApprovals,
        pendingPayments,
      },
    };
  }

  private async getProjectOverview(
    businessId: number,
  ): Promise<ProjectOverview> {
    const [total, active, completed, onHold, recentProjects] =
      await Promise.all([
        this.prismaService.project.count({ where: { businessId } }),
        this.prismaService.project.count({
          where: { businessId, status: 'ongoing' },
        }),
        this.prismaService.project.count({
          where: { businessId, status: 'complete' },
        }),
        this.prismaService.project.count({
          where: { businessId, status: 'pending' },
        }),
        this.prismaService.project.findMany({
          where: { businessId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            _count: {
              select: { projectMembers: true },
            },
          },
        }),
      ]);

    // console.log({ recentProjects });
    return {
      total,
      active,
      completed,
      onHold,
      recentProjects: recentProjects.map((project) => ({
        name: project.name,
        status: project.status,
        memberCount: project._count.projectMembers,
        startDate: project.startDate as Date,
        endDate: project?.endDate ? project?.endDate : undefined,
      })),
    };
  }

  private async getRecentActivities(
    businessId: number,
  ): Promise<RecentActivities> {
    const [unreadNotifications, recentLeaves, recentAttendances] =
      await Promise.all([
        this.prismaService.notification.count({
          where: {
            user: { businessId },
            readAt: null,
          },
        }),
        this.prismaService.leave.findMany({
          where: { user: { businessId } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            user: { select: { profile: { select: { fullName: true } } } },
          },
        }),
        this.prismaService.attendance.findMany({
          where: { user: { businessId } },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            user: { select: { profile: { select: { fullName: true } } } },
          },
        }),
      ]);

    const activities: RecentActivityItem[] = [
      ...recentLeaves.map((leave) => ({
        type: 'LEAVE',
        message: `${leave.user?.profile?.fullName || 'Unknown'} requested leave (${leave.status})`,
        timestamp: leave.createdAt,
      })),
      ...recentAttendances.map((attendance) => ({
        type: 'ATTENDANCE',
        message: `${attendance?.user?.profile?.fullName || 'Unknown'} marked ${attendance.status}`,
        timestamp: attendance.createdAt,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      unreadNotifications,
      recentActivities: activities,
    };
  }
}
