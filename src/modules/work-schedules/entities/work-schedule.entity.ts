// WORK SCHEDULE ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR WORK SCHEDULE MANAGEMENT
import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { Business } from 'src/modules/businesses/entities/business.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DaySchedule } from './day-schedule.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { ScheduleBreakType, ScheduleType, Status } from 'generated/prisma';
// import { Status, ScheduleType, ScheduleBreakType } from 'src/enums/global';

// Register enums for GraphQL
registerEnumType(Status, {
  name: 'Status',
});

registerEnumType(ScheduleType, {
  name: 'ScheduleType',
});

registerEnumType(ScheduleBreakType, {
  name: 'ScheduleBreakType',
});

@ObjectType()
export class WorkSchedule {
  @Field(() => ID, {
    description: 'Unique identifier for the work schedule',
  })
  id: number;

  @Field(() => String, {
    description: 'Name of the work schedule',
  })
  name: string;

  @Field(() => String, {
    description: 'Description of the work schedule',
  })
  description: string;

  @Field(() => Status, {
    description: 'Status of the work schedule',
    defaultValue: Status.ACTIVE,
  })
  status: Status;

  @Field(() => ScheduleType, {
    description: 'Type of the schedule',
    defaultValue: ScheduleType.REGULAR,
  })
  scheduleType: ScheduleType;

  @Field(() => ScheduleBreakType, {
    description: 'Type of break in the schedule',
    defaultValue: ScheduleBreakType.UNPAID,
  })
  breakType: ScheduleBreakType;

  @Field(() => Int, {
    description: 'Number of break hours',
    defaultValue: 0,
  })
  breakHours: number;

  @Field(() => Int, {
    description: 'ID of the business',
    nullable: true,
  })
  businessId: number;

  @Field(() => Business, {
    description: 'Business this work schedule belongs to',
    nullable: true,
  })
  business: Business;

  @Field(() => Int, {
    description: 'ID of the user who created this schedule',
    nullable: true,
  })
  createdBy: number;

  @Field(() => User, {
    description: 'User who created this work schedule',
    nullable: true,
  })
  creator: User;

  @Field(() => [DaySchedule], {
    description: 'Day schedules associated with this work schedule',
  })
  schedules: DaySchedule[];

  @Field(() => Date, {
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}

@ObjectType()
export class WorkScheduleResponse extends BaseResponse(WorkSchedule) {}

@ObjectType()
export class WorkSchedulesQueryResponse extends BaseQueryResponse(
  WorkSchedule,
) {}
