// LEAVE TYPE ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR LEAVE TYPE
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { EmploymentStatus } from 'src/modules/employment-status/entities/employment-status.entity';
import { LeaveRolloverType, LeaveTypeEnum } from '../enums';
import { Status } from 'src/common/enums';
import { IsInt } from 'class-validator';

@ObjectType()
export class LeaveType {
  @Field(() => ID, {
    description: 'Unique identifier for the leave type',
  })
  @IsInt()
  id: number;

  @Field(() => String, { description: 'Name of the leave type' })
  name: string;

  @Field(() => LeaveTypeEnum, { description: 'Type of leave (PAID or UNPAID)' })
  leaveType: LeaveTypeEnum;

  @Field(() => Int, { description: 'Number of leave minutes allocated' })
  leaveMinutes: number;

  @Field(() => LeaveRolloverType, { description: 'Leave rollover policy type' })
  leaveRolloverType: LeaveRolloverType;

  @Field(() => Int, { description: 'Maximum carry over limit', nullable: true })
  carryOverLimit: number;

  @Field(() => Status, { description: 'Status of the leave type' })
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => [EmploymentStatus], {
    description: 'Array of employment statuses associated with this leave type',
    nullable: true,
  })
  employmentStatuses?: EmploymentStatus[] | null;

  @Field(() => Date, {
    description: 'Date when the leave type was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the leave type was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class LeaveTypeResponse extends BaseResponse(LeaveType) {}

@ObjectType()
export class LeaveTypesQueryResponse extends BaseQueryResponse(LeaveType) {}
