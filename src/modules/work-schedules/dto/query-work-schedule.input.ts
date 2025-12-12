import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ScheduleType } from '../enums';
import { Status } from 'src/common/enums';

@InputType()
export class QueryWorkScheduleInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @Field(() => ScheduleType, { nullable: true })
  @IsOptional()
  @IsEnum(ScheduleType)
  scheduleType?: ScheduleType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}
