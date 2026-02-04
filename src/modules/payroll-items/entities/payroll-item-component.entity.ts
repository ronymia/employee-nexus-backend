import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PayrollComponent } from '../../payroll-components/entities/payroll-component.entity';

@ObjectType()
export class PayrollItemComponent {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  payrollItemId: number;

  @Field(() => Int)
  payrollComponentId: number;

  @Field(() => PayrollComponent, { nullable: true })
  payrollComponent?: PayrollComponent;

  @Field(() => String)
  componentType: string; // EARNING or DEDUCTION

  @Field(() => String)
  calculationType: string; // FIXED_AMOUNT or PERCENTAGE_OF_BASIC

  @Field(() => Float)
  value: number; // Value used (custom or default)

  @Field(() => Float)
  calculatedAmount: number; // Final calculated amount

  @Field(() => Date)
  createdAt: Date;
}
