import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class ApprovePayrollItemsInput {
  @Field(() => Int)
  @IsNumber()
  payrollCycleId: number;
}
