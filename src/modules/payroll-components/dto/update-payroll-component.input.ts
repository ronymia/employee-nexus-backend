import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CreatePayrollComponentInput } from './create-payroll-component.input';

@InputType()
export class UpdatePayrollComponentInput extends PartialType(
  CreatePayrollComponentInput,
) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
