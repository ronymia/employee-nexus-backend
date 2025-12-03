import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class AddPayslipAdjustmentInput {
  @Field(() => Int)
  @IsNumber()
  payrollItemId: number;

  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  // @Field(() => Int)
  // @IsNumber()
  // createdBy: number;
}
