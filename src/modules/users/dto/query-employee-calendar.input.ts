import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, IsDateString } from 'class-validator';

@InputType()
export class QueryEmployeeCalendarInput {
  @Field(() => Int, { nullable: true, description: 'Employee user ID' })
  @IsOptional()
  @IsInt()
  userId?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field(() => String, { nullable: true, description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Int, { nullable: true, description: 'Year filter (e.g., 2026)' })
  @IsOptional()
  @IsInt()
  year?: number;

  @Field(() => Int, { nullable: true, description: 'Month filter (1-12)' })
  @IsOptional()
  @IsInt()
  month?: number;
}
