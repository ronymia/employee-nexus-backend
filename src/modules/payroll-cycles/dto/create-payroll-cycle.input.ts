import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PayrollFrequency } from '../enums/payroll-frequency.enum';

@InputType()
export class CreatePayrollCycleInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => PayrollFrequency)
  @IsEnum(PayrollFrequency)
  frequency: PayrollFrequency;

  @Field()
  @IsDateString()
  periodStart: string;

  @Field()
  @IsDateString()
  periodEnd: string;

  @Field()
  @IsDateString()
  paymentDate: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;

  @Field(() => Int, {
    nullable: true,
    description: 'Business ID for the payroll cycle',
  })
  @IsNumber()
  @IsOptional()
  businessId?: number;
}
