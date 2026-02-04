import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class PayrollItemAsPaidInput {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field(() => String)
  @IsString()
  paymentMethod: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @Field(() => Int)
  @IsNumber()
  payrollCycleId: number;
}
