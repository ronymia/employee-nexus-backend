import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';

@InputType()
export class CreatePayslipAdjustmentInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Int)
  @IsInt()
  payrollComponentId?: number;

  @Field(() => Date)
  @IsDateString()
  appliedMonth: Date;

  @Field(() => String)
  @IsString()
  remarks: string;

  @Field(() => Float)
  @IsNumber()
  value: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;
}
