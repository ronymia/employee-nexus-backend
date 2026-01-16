import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { SalaryType } from '../entities/employee-salary.entity';

@InputType()
export class CreateEmployeeSalaryInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @Field(() => Float, { description: 'Salary amount' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salaryAmount: number;

  @Field(() => SalaryType, {
    description: 'Type of salary (HOURLY, DAILY, MONTHLY)',
  })
  @IsNotEmpty()
  @IsEnum(SalaryType)
  salaryType: SalaryType;

  @Field(() => String, { description: 'Start date of the salary (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @Field(() => String, {
    nullable: true,
    description: 'End date of the salary (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

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
