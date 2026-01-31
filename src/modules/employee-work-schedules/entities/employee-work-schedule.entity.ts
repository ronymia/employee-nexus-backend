import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { WorkSchedule } from 'src/modules/work-schedules/entities/work-schedule.entity';
import { Employee } from 'src/modules/users/entities/employee.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class EmployeeWorkSchedule {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Employee, { description: 'Employee relation' })
  employee: Employee;

  @Field(() => Int, { description: 'Work Schedule ID' })
  @IsInt()
  workScheduleId: number;

  @Field(() => WorkSchedule, { description: 'Work Schedule relation' })
  workSchedule: WorkSchedule;

  @Field(() => Date, { description: 'Start Date' })
  @IsDate()
  startDate: Date;

  @Field(() => Date, { nullable: true, description: 'End Date' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => Boolean, {
    description: 'Whether this schedule assignment is currently active',
  })
  @IsBoolean()
  isActive: boolean;

  @Field(() => Int, { description: 'User ID who assigned this schedule' })
  @IsInt()
  assignedBy: number;

  @Field(() => User, { description: 'User who assigned this schedule' })
  assignedByUser: User;

  @Field(() => String, { nullable: true, description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @Field(() => Date, { description: 'Created timestamp' })
  @IsDate()
  createdAt: Date;

  @Field(() => Date, { description: 'Updated timestamp' })
  @IsDate()
  updatedAt: Date;
}

@ObjectType()
export class EmployeeWorkScheduleResponse extends BaseResponse(
  EmployeeWorkSchedule,
) {}

@ObjectType()
export class EmployeeWorkSchedulesArrayResponse extends BaseQueryResponse(
  EmployeeWorkSchedule,
) {}
