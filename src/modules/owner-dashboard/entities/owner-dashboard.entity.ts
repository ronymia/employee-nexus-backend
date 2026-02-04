import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseResponse } from 'src/common/dto/base-response.type';

// ============ Business Overview ============
@ObjectType()
export class BusinessOverview {
  @Field(() => Int)
  totalEmployees: number;

  @Field(() => Int)
  activeEmployees: number;

  @Field(() => Int)
  inactiveEmployees: number;

  @Field(() => Int)
  totalDepartments: number;

  @Field(() => Int)
  totalProjects: number;

  @Field(() => Int)
  activeProjects: number;

  @Field(() => Float)
  totalMonthlyPayroll: number;

  @Field(() => Float)
  pendingPayrollAmount: number;
}

// ============ Attendance Analytics ============
@ObjectType()
export class AttendanceToday {
  @Field(() => Int)
  present: number;

  @Field(() => Int)
  absent: number;

  @Field(() => Int)
  late: number;

  @Field(() => Int)
  onLeave: number;

  @Field(() => Int)
  notPunchedIn: number;

  @Field(() => Int)
  attendanceOnToday: number;
}

@ObjectType()
export class AttendanceThisWeek {
  @Field(() => Float)
  averageAttendanceRate: number;

  @Field(() => Int)
  totalWorkingDays: number;

  @Field(() => Int)
  totalPresentDays: number;
}

@ObjectType()
export class AttendanceThisMonth {
  @Field(() => Float)
  attendanceRate: number;

  @Field(() => Int)
  lateArrivals: number;

  @Field(() => Int)
  earlyDepartures: number;
}

@ObjectType()
export class AttendanceTrend {
  @Field()
  date: string;

  @Field(() => Int)
  presentCount: number;
}

@ObjectType()
export class AttendanceAnalytics {
  @Field(() => AttendanceToday)
  today: AttendanceToday;

  @Field(() => AttendanceThisWeek)
  thisWeek: AttendanceThisWeek;

  @Field(() => AttendanceThisMonth)
  thisMonth: AttendanceThisMonth;

  @Field(() => [AttendanceTrend])
  trend: AttendanceTrend[];
}

// ============ Leave Stats ============
@ObjectType()
export class LeaveByType {
  @Field()
  leaveType: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class LeaveThisMonth {
  @Field(() => Int)
  total: number;

  @Field(() => [LeaveByType])
  byType: LeaveByType[];
}

@ObjectType()
export class UpcomingLeave {
  @Field()
  employeeName: string;

  @Field()
  leaveType: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

@ObjectType()
export class LeaveStats {
  @Field(() => Int)
  pending: number;

  @Field(() => Int)
  approved: number;

  @Field(() => Int)
  rejected: number;

  @Field(() => LeaveThisMonth)
  thisMonth: LeaveThisMonth;

  @Field(() => [UpcomingLeave])
  upcomingLeaves: UpcomingLeave[];
}

// ============ Payroll Summary ============
@ObjectType()
export class PayrollCurrentCycle {
  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  periodStart: Date;

  @Field()
  periodEnd: Date;

  @Field()
  paymentDate: Date;

  @Field(() => Int)
  totalEmployees: number;

  @Field(() => Float)
  totalGrossPay: number;

  @Field(() => Float)
  totalDeductions: number;

  @Field(() => Float)
  totalNetPay: number;
}

@ObjectType()
export class MonthAmount {
  @Field()
  month: string;

  @Field(() => Float)
  amount: number;
}

@ObjectType()
export class PayrollYearToDate {
  @Field(() => Float)
  totalPaid: number;

  @Field(() => Float)
  averageMonthlyPayroll: number;

  @Field(() => MonthAmount)
  highestMonth: MonthAmount;

  @Field(() => MonthAmount)
  lowestMonth: MonthAmount;
}

@ObjectType()
export class PayrollPendingActions {
  @Field(() => Int)
  draftCycles: number;

  @Field(() => Int)
  pendingApprovals: number;

  @Field(() => Int)
  pendingPayments: number;
}

@ObjectType()
export class PayrollSummary {
  @Field(() => PayrollCurrentCycle)
  currentCycle: PayrollCurrentCycle;

  @Field(() => PayrollYearToDate)
  yearToDate: PayrollYearToDate;

  @Field(() => PayrollPendingActions)
  pendingActions: PayrollPendingActions;
}

// ============ Project Overview ============
@ObjectType()
export class RecentProject {
  @Field()
  name: string;

  @Field()
  status: string;

  @Field(() => Int)
  memberCount: number;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  endDate?: Date;
}

@ObjectType()
export class ProjectOverview {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  active: number;

  @Field(() => Int)
  completed: number;

  @Field(() => Int)
  onHold: number;

  @Field(() => [RecentProject])
  recentProjects: RecentProject[];
}

// ============ Recent Activities ============
@ObjectType()
export class RecentActivityItem {
  @Field()
  type: string;

  @Field()
  message: string;

  @Field()
  timestamp: Date;
}

@ObjectType()
export class RecentActivities {
  @Field(() => Int)
  unreadNotifications: number;

  @Field(() => [RecentActivityItem])
  recentActivities: RecentActivityItem[];
}

// ============ Main Dashboard ============
@ObjectType()
export class OwnerDashboard {
  @Field(() => BusinessOverview)
  businessOverview: BusinessOverview;

  @Field(() => AttendanceAnalytics)
  attendanceAnalytics: AttendanceAnalytics;

  @Field(() => LeaveStats)
  leaveStats: LeaveStats;

  @Field(() => PayrollSummary)
  payrollSummary: PayrollSummary;

  @Field(() => ProjectOverview)
  projectOverview: ProjectOverview;

  @Field(() => RecentActivities)
  recentActivities: RecentActivities;
}

@ObjectType()
export class OwnerDashboardResponse extends BaseResponse(OwnerDashboard) {}
