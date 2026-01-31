import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsString,
} from 'class-validator';

@InputType()
export class CreatePayslipAdjustmentInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  payrollComponentId?: number;

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
