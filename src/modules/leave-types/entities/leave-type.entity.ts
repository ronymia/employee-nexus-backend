// LEAVE TYPE ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR LEAVE TYPE
import { ObjectType, Field, Int, registerEnumType, ID } from '@nestjs/graphql';
import { Status, LeaveRolloverType } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { EmploymentStatus } from 'src/modules/employment-status/entities/employment-status.entity';

// LEAVE TYPE ENUM - DEFINES PAID AND UNPAID LEAVE TYPES
export enum LeaveTypeEnum {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

registerEnumType(LeaveTypeEnum, {
  name: 'LeaveTypeEnum',
  description: 'Type of leave - paid or unpaid',
});

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Leave Type',
});

registerEnumType(LeaveRolloverType, {
  name: 'LeaveRolloverType',
  description: 'Type of leave rollover policy',
});

@ObjectType()
export class LeaveType {
  @Field(() => ID, {
    description: 'Unique identifier for the leave type',
  })
  id: number;

  @Field(() => String, { description: 'Name of the leave type' })
  name: string;

  @Field(() => LeaveTypeEnum, { description: 'Type of leave (PAID or UNPAID)' })
  leaveType: LeaveTypeEnum;

  @Field(() => Int, { description: 'Number of leave hours allocated' })
  leaveHours: number;

  @Field(() => LeaveRolloverType, { description: 'Leave rollover policy type' })
  leaveRolloverType: LeaveRolloverType;

  @Field(() => Int, { description: 'Maximum carry over limit', nullable: true })
  carryOverLimit: number;

  @Field(() => Status, { description: 'Status of the leave type' })
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => [EmploymentStatus], {
    description: 'Array of employment statuses associated with this leave type',
    nullable: true,
  })
  employmentStatuses?: EmploymentStatus[];

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
