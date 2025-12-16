import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { LeaveDuration } from '../enums';

@InputType()
export class QueryLeaveInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  leaveTypeId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  leaveYear?: number;

  @Field(() => LeaveDuration, { nullable: true })
  @IsOptional()
  leaveDuration?: LeaveDuration;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field(() => String, {
    description: 'Filter leaves starting from this date',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @Field(() => String, {
    description: 'Filter leaves ending before this date',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @Field(() => Int, { nullable: true, description: 'User ID' })
  @IsInt()
  @IsOptional()
  userId?: number;
}
