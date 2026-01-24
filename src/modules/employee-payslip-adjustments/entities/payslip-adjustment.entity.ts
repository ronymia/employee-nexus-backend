import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';
import { PayrollComponent } from 'src/modules/payroll-components/entities/payroll-component.entity';
import { AdjustmentStatus } from '../enums/adjustment-status.enum';

@ObjectType()
export class PayslipAdjustment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Int, { nullable: true })
  payrollItemId?: number;

  @Field(() => Int, { nullable: true })
  payrollComponentId?: number;

  @Field(() => PayrollComponent, { nullable: true })
  payrollComponent?: PayrollComponent;

  @Field(() => String)
  remarks: string;

  @Field(() => Float)
  value: number;

  @Field(() => Date, { nullable: true })
  appliedMonth?: Date;

  @Field(() => AdjustmentStatus)
  status: AdjustmentStatus;

  @Field(() => Int)
  requestedBy: number;

  @Field(() => User, { nullable: true })
  requestedByUser?: User;

  @Field(() => Int, { nullable: true })
  reviewedBy?: number;

  @Field(() => User, { nullable: true })
  reviewedByUser?: User;

  @Field(() => Date, { nullable: true })
  reviewedAt?: Date;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class PayslipAdjustmentResponse extends BaseResponse(
  PayslipAdjustment,
) {}

@ObjectType()
export class PayslipAdjustmentsQueryResponse extends BaseQueryResponse(
  PayslipAdjustment,
) {}
