import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class ProcessPayrollCycleInput {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field(() => Int)
  @IsNumber()
  processedBy: number;
}
