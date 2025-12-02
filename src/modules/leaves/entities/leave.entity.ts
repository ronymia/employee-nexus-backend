import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { LeaveDuration } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { LeaveType } from 'src/modules/leave-types/entities/leave-type.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Leave {
  @Field(() => ID, { description: 'Unique identifier for the leave' })
  id: number;

  @Field(() => Int, { description: 'ID of the user requesting leave' })
  userId: number;

  @Field(() => User, {
    description: 'User who requested the leave',
    nullable: true,
  })
  user?: User;

  @Field(() => Int, { description: 'ID of the leave type' })
  leaveTypeId: number;

  @Field(() => LeaveType, { description: 'Leave type', nullable: true })
  leaveType?: LeaveType;

  @Field(() => Int, {
    description: 'Year this leave applies to (e.g., 2025)',
  })
  leaveYear: number;

  @Field(() => String, {
    description: 'Leave duration type (SINGLE_DAY, MULTI_DAY, HALF_DAY)',
  })
  leaveDuration: LeaveDuration;

  @Field(() => Date, { description: 'Leave start date' })
  startDate: Date;

  @Field(() => Date, {
    description: 'Leave end date (null for single day)',
    nullable: true,
  })
  endDate?: Date;

  @Field(() => Float, {
    description: 'Total leave hours deducted from balance',
  })
  totalHours: number;

  @Field(() => String, {
    description: 'Leave status (pending, approved, rejected, cancelled)',
  })
  status: string;

  @Field(() => Date, {
    description: 'When leave was approved/rejected',
    nullable: true,
  })
  reviewedAt?: Date;

  @Field(() => Int, {
    description: 'ID of manager/admin who reviewed',
    nullable: true,
  })
  reviewedBy?: number;

  @Field(() => User, {
    description: 'Manager/admin who reviewed the leave',
    nullable: true,
  })
  reviewer?: User;

  @Field(() => String, {
    description: 'Reason for rejection if rejected',
    nullable: true,
  })
  rejectionReason?: string;

  @Field(() => String, {
    description: 'Supporting documents (JSON array or URLs)',
    nullable: true,
  })
  attachments?: string;

  @Field(() => String, {
    description: 'Additional notes or comments',
    nullable: true,
  })
  notes?: string;

  @Field(() => Date, { description: 'Date when the leave was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date when the leave was last updated' })
  updatedAt: Date;
}

@ObjectType()
export class LeaveResponse extends BaseResponse(Leave) {}

@ObjectType()
export class LeavesQueryResponse extends BaseQueryResponse(Leave) {}
