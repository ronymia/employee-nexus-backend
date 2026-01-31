import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PaginationMeta } from 'src/common/dto/paginated-meta.type';

@ObjectType()
export class AttendanceDateInfo {
  @Field(() => Date, { description: 'Attendance date' })
  date: Date;

  @Field(() => String, {
    description:
      'Attendance status (present, absent, late, half_day, on_leave)',
  })
  status: string;

  @Field(() => Int, { description: 'Total minutes worked' })
  totalMinutes: number;

  @Field(() => Int, { description: 'Break minutes' })
  breakMinutes: number;

  @Field(() => Int, { description: 'Overtime minutes' })
  overtimeMinutes: number;
}

@ObjectType()
export class LeaveDateInfo {
  @Field(() => Date, { description: 'Leave start date' })
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Leave end date',
  })
  endDate?: Date;

  @Field(() => String, {
    description: 'Leave status (pending, approved, rejected, cancelled)',
  })
  status: string;

  @Field(() => String, {
    description: 'Leave duration (SINGLE_DAY, MULTI_DAY, HALF_DAY)',
  })
  leaveDuration: string;

  @Field(() => Number, { description: 'Total minutes for this leave' })
  totalMinutes: number;
}

@ObjectType()
export class HolidayDateInfo {
  @Field(() => Date, { description: 'Holiday start date' })
  startDate: Date;

  @Field(() => Date, { description: 'Holiday end date' })
  endDate: Date;

  @Field(() => String, { description: 'Holiday name' })
  name: string;

  @Field(() => String, { nullable: true, description: 'Holiday description' })
  description?: string;

  @Field(() => Boolean, { description: 'Is paid holiday' })
  isPaid: boolean;

  @Field(() => String, {
    description: 'Holiday type (PUBLIC, RELIGIOUS, COMPANY_SPECIFIC, REGIONAL)',
  })
  holidayType: string;

  @Field(() => Boolean, { description: 'Is recurring holiday' })
  isRecurring: boolean;
}

@ObjectType()
export class EmployeeCalendarData {
  @Field(() => Date, {
    nullable: true,
    description: 'Employee joining date',
  })
  joiningDate?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Business registration date',
  })
  registrationDate?: Date;

  @Field(() => [AttendanceDateInfo], {
    description: 'List of attendance dates',
  })
  attendances: AttendanceDateInfo[];

  @Field(() => [LeaveDateInfo], { description: 'List of leave dates' })
  leaves: LeaveDateInfo[];

  @Field(() => [HolidayDateInfo], { description: 'List of holidays' })
  holidays: HolidayDateInfo[];
}

@ObjectType()
export class EmployeeCalendarResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => EmployeeCalendarData)
  data: EmployeeCalendarData;

  @Field(() => PaginationMeta, { nullable: true })
  meta?: PaginationMeta;
}
