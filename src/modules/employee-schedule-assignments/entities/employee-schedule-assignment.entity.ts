import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { WorkSchedule } from 'src/modules/work-schedules/entities/work-schedule.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class EmployeeScheduleAssignment {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { description: 'ID of the user/employee' })
  userId: number;

  @Field(() => User, {
    nullable: true,
    description: 'User/employee assigned to schedule',
  })
  user?: User;

  @Field(() => Int, { description: 'ID of the work schedule' })
  workScheduleId: number;

  @Field(() => WorkSchedule, {
    nullable: true,
    description: 'Assigned work schedule',
  })
  workSchedule?: WorkSchedule;

  @Field(() => Date, { description: 'Assignment start date' })
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Assignment end date',
  })
  endDate?: Date | null;

  @Field(() => Boolean, { description: 'Whether this is the active schedule' })
  isActive: boolean;

  @Field(() => Int, { description: 'ID of user who assigned the schedule' })
  assignedBy: number;

  @Field(() => User, {
    nullable: true,
    description: 'User who assigned the schedule',
  })
  assignedByUser?: User;

  @Field(() => String, {
    nullable: true,
    description: 'Optional notes about assignment',
  })
  notes?: string | null;

  @Field(() => Date, { description: 'Date when the record was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date when the record was last updated' })
  updatedAt: Date;
}

@ObjectType()
export class EmployeeScheduleAssignmentResponse extends BaseResponse(
  EmployeeScheduleAssignment,
) {}

@ObjectType()
export class EmployeeScheduleAssignmentsQueryResponse extends BaseQueryResponse(
  EmployeeScheduleAssignment,
) {}
