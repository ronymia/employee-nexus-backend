// CREATE LEAVE TYPE INPUT - DEFINES THE STRUCTURE FOR CREATING NEW LEAVE TYPE RECORDS
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsEnum,
  Min,
  IsOptional,
  IsArray,
} from 'class-validator';
import { LeaveRolloverType, LeaveTypeEnum } from '../enums';

@InputType()
export class CreateLeaveTypeInput {
  @Field(() => String, { description: 'Name of the leave type' })
  @IsString()
  name: string;

  @Field(() => LeaveTypeEnum, { description: 'Type of leave (PAID or UNPAID)' })
  @IsEnum(LeaveTypeEnum)
  leaveType: LeaveTypeEnum;

  @Field(() => Int, {
    description: 'Number of leave minutes allocated',
    defaultValue: 0,
  })
  @IsInt()
  @Min(0)
  leaveMinutes: number;

  @Field(() => LeaveRolloverType, {
    description: 'Leave rollover policy type',
    defaultValue: LeaveRolloverType.NONE,
  })
  @IsEnum(LeaveRolloverType)
  leaveRolloverType: LeaveRolloverType;

  @Field(() => Int, { description: 'Maximum carry over limit', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  carryOverLimit?: number;

  @Field(() => [Int], {
    description:
      'Array of employment status IDs to associate with this leave type',
    nullable: true,
    defaultValue: [],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  employmentStatuses?: number[];
}
