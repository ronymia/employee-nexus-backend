import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class GeneratePayrollItemsInput {
  @Field(() => Int)
  @IsNumber()
  payrollCycleId: number;

  @Field(() => Int)
  @IsNumber()
  businessId: number;
}
