import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PayrollCycleStatus } from '../enums/payroll-cycle-status.enum';
import { PayrollFrequency } from '../enums/payroll-frequency.enum';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';

@ObjectType()
export class PayrollCycle {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => PayrollFrequency)
  frequency: PayrollFrequency;

  @Field()
  periodStart: Date;

  @Field()
  periodEnd: Date;

  @Field()
  paymentDate: Date;

  @Field(() => PayrollCycleStatus)
  status: PayrollCycleStatus;

  @Field(() => Float)
  totalGrossPay: number;

  @Field(() => Float)
  totalDeductions: number;

  @Field(() => Float)
  totalNetPay: number;

  @Field(() => Int)
  totalEmployees: number;

  @Field(() => Int, { nullable: true })
  approvedBy?: number;

  @Field({ nullable: true })
  approvedAt?: Date;

  @Field(() => Int, { nullable: true })
  processedBy?: number;

  @Field({ nullable: true })
  processedAt?: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => Int)
  businessId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PayrollCycleResponse extends BaseResponse(PayrollCycle) {}

@ObjectType()
export class PayrollCyclesQueryResponse extends BaseQueryResponse(
  PayrollCycle,
) {}
