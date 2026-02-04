import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseResponse } from 'src/common/dto/base-response.type';

// ============ Personal Info ============
@ObjectType()
export class PersonalInfo {
  @Field()
  fullName: string;

  @Field()
  employeeId: string;

  @Field()
  department: string;

  @Field()
  designation: string;

  @Field()
  joiningDate: Date;

  @Field()
  email: string;

  @Field()
  phone: string;
}

// ============ Attendance Summary ============
@ObjectType()
export class AttendanceTodays {
  @Field()
  status: string;

  @Field({ nullable: true })
  checkInTime?: Date;

  @Field({ nullable: true })
  checkOutTime?: Date;

  @Field(() => Float, { nullable: true })
  workingHours?: number;
}

@ObjectType()
export class AttendanceThisMonths {
  @Field(() => Int)
  totalPresent: number;

  @Field(() => Int)
  totalAbsent: number;

  @Field(() => Int)
  totalLate: number;

  @Field(() => Float)
  attendanceRate: number;
}

@ObjectType()
export class RecentAttendanceItem {
  @Field()
  date: Date;

  @Field()
  status: string;

  @Field({ nullable: true })
  checkInTime?: Date;

  @Field({ nullable: true })
  checkOutTime?: Date;
}

@ObjectType()
export class AttendanceSummary {
  @Field(() => AttendanceTodays)
  today: AttendanceTodays;

  @Field(() => AttendanceThisMonths)
  thisMonth: AttendanceThisMonths;

  @Field(() => [RecentAttendanceItem])
  recentAttendance: RecentAttendanceItem[];
}

// ============ Leave Summary ============
@ObjectType()
export class AvailableLeave {
  @Field()
  leaveType: string;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  used: number;

  @Field(() => Int)
  remaining: number;
}

@ObjectType()
export class UpcomingLeaveItem {
  @Field()
  leaveType: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  endDate: Date;

  @Field()
  status: string;
}

@ObjectType()
export class LeaveHistoryItem {
  @Field()
  leaveType: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field()
  status: string;

  @Field({ nullable: true })
  reason?: string;
}

@ObjectType()
export class LeaveSummary {
  @Field(() => [AvailableLeave])
  availableLeaves: AvailableLeave[];

  @Field(() => [UpcomingLeaveItem])
  upcomingLeaves: UpcomingLeaveItem[];

  @Field(() => [LeaveHistoryItem])
  leaveHistory: LeaveHistoryItem[];
}

// ============ Payroll Summary ============
@ObjectType()
export class CurrentMonthPayroll {
  @Field(() => Float)
  grossPay: number;

  @Field(() => Float)
  totalDeductions: number;

  @Field(() => Float)
  netPay: number;

  @Field()
  status: string;
}

@ObjectType()
export class LastPayment {
  @Field()
  month: string;

  @Field(() => Float)
  grossPay: number;

  @Field(() => Float)
  netPay: number;

  @Field({ nullable: true })
  @IsOptional()
  paidDate?: Date;
}

@ObjectType()
export class YearToDatePayroll {
  @Field(() => Float)
  totalGrossPay: number;

  @Field(() => Float)
  totalDeductions: number;

  @Field(() => Float)
  totalNetPay: number;
}

@ObjectType()
export class PayrollSummarys {
  @Field(() => CurrentMonthPayroll)
  currentMonth: CurrentMonthPayroll;

  @Field(() => LastPayment)
  lastPayment: LastPayment;

  @Field(() => YearToDatePayroll)
  yearToDate: YearToDatePayroll;
}

// ============ Task Overview ============
@ObjectType()
export class RecentTask {
  @Field()
  title: string;

  @Field()
  project: string;

  @Field()
  status: string;

  @Field()
  dueDate: Date;

  @Field()
  priority: string;
}

@ObjectType()
export class TaskOverview {
  @Field(() => Int)
  assigned: number;

  @Field(() => Int)
  inProgress: number;

  @Field(() => Int)
  completed: number;

  @Field(() => Int)
  overdue: number;

  @Field(() => [RecentTask])
  recentTasks: RecentTask[];
}

// ============ Notifications ============
@ObjectType()
export class RecentNotification {
  @Field()
  type: string;

  @Field()
  message: string;

  @Field()
  timestamp: Date;

  @Field({ nullable: true })
  readAt?: Date;
}

@ObjectType()
export class Notifications {
  @Field(() => Int)
  unread: number;

  @Field(() => [RecentNotification])
  recent: RecentNotification[];
}

// ============ Main Dashboard ============
@ObjectType()
export class EmployeeDashboard {
  @Field(() => PersonalInfo)
  personalInfo: PersonalInfo;

  @Field(() => AttendanceSummary)
  attendanceSummary: AttendanceSummary;

  @Field(() => LeaveSummary)
  leaveSummary: LeaveSummary;

  @Field(() => PayrollSummarys)
  payrollSummary: PayrollSummarys;

  @Field(() => TaskOverview)
  taskOverview: TaskOverview;

  @Field(() => Notifications)
  notifications: Notifications;
}

@ObjectType()
export class EmployeeDashboardResponse extends BaseResponse(
  EmployeeDashboard,
) {}
