import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
} from 'class-validator';
import { SalaryType } from '../entities/employee-salary.entity';

@InputType()
export class UpdateEmployeeSalaryInput {
  @Field(() => Int, { description: 'Unique identifier of the salary record' })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Field(() => Float, { nullable: true, description: 'Salary amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryAmount?: number;

  @Field(() => SalaryType, {
    nullable: true,
    description: 'Type of salary (HOURLY, DAILY, MONTHLY)',
  })
  @IsOptional()
  @IsEnum(SalaryType)
  salaryType?: SalaryType;

  @Field(() => String, {
    nullable: true,
    description: 'Start date of the salary (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field(() => String, {
    nullable: true,
    description: 'End date of the salary (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether this salary is currently active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => String, {
    nullable: true,
    description: 'Reason for salary change',
  })
  @IsOptional()
  reason?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Additional remarks',
  })
  @IsOptional()
  remarks?: string;
}
