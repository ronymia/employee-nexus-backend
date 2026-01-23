import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
} from 'class-validator';

@InputType()
export class AssignEmployeePayrollComponentInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Int)
  @IsInt()
  componentId: number;

  @Field(() => Float, {
    description: 'The value of the payroll component for the employee',
  })
  @IsNumber()
  value: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isOverride?: boolean;

  @Field(() => Date)
  @IsDateString()
  effectiveFrom: Date;

  @Field(() => Date, { nullable: true })
  @IsDateString()
  @IsOptional()
  effectiveTo?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  notes?: string;
}
