import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { LeaveDuration } from '../enums';

@InputType()
export class CreateLeaveInput {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'ID of the leave type' })
  @IsInt()
  leaveTypeId: number;

  @Field(() => Int, { description: 'Year this leave applies to (e.g., 2025)' })
  @IsInt()
  leaveYear: number;

  @Field(() => LeaveDuration, {
    description: 'Leave duration type (SINGLE_DAY, MULTI_DAY, HALF_DAY)',
  })
  @IsEnum(LeaveDuration)
  leaveDuration: LeaveDuration;

  @Field(() => Date, { description: 'Leave start date' })
  @IsDateString()
  startDate: string;

  @Field(() => Date, {
    description: 'Leave end date (required for MULTI_DAY)',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @Field(() => String, {
    description: 'Supporting documents (JSON array or URLs)',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  attachments?: string;

  @Field(() => String, {
    description: 'Additional notes or comments',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
