import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base-response.type';

@ObjectType()
export class PayrollComponentOverview {
  @Field(() => Int, { defaultValue: 0 })
  total: number;

  @Field(() => Int, { defaultValue: 0 })
  earning: number;

  @Field(() => Int, { defaultValue: 0 })
  deduction: number;

  @Field(() => Int, { defaultValue: 0 })
  fixedAmount: number;

  @Field(() => Int, { defaultValue: 0 })
  percentageOfBasic: number;

  @Field(() => Int, { defaultValue: 0 })
  active: number;

  @Field(() => Int, { defaultValue: 0 })
  draft: number;

  @Field(() => Int, { defaultValue: 0 })
  disabled: number;

  @Field(() => Int, { defaultValue: 0 })
  taxable: number;

  @Field(() => Int, { defaultValue: 0 })
  nonTaxable: number;

  @Field(() => Int, { defaultValue: 0 })
  statutory: number;

  @Field(() => Int, { defaultValue: 0 })
  nonStatutory: number;
}

@ObjectType()
export class PayrollComponentOverviewResponse extends BaseResponse(
  PayrollComponentOverview,
) {}
