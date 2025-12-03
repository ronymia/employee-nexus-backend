import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PayrollItemStatus } from '../enums/payroll-item-status.enum';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';
import { PayrollComponent } from 'src/modules/payroll-components/entities/payroll-component.entity';

@ObjectType()
export class PayrollItemComponent {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  payrollItemId: number;

  @Field(() => Int)
  componentId: number;

  @Field(() => PayrollComponent, { description: 'Payroll Component' })
  component: PayrollComponent;

  @Field(() => Float)
  amount: number;

  @Field(() => Float, { nullable: true })
  calculationBase?: number;

  @Field({ nullable: true })
  notes?: string;
}

@ObjectType()
export class PayslipAdjustment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  payrollItemId: number;

  @Field()
  type: string;

  @Field()
  description: string;

  @Field(() => Float)
  amount: number;

  @Field()
  isRecurring: boolean;

  @Field(() => Int)
  createdBy: number;

  @Field({ nullable: true })
  notes?: string;
}

@ObjectType()
export class PayrollItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  payrollCycleId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => User, { description: 'User' })
  user: User;

  @Field(() => Float)
  basicSalary: number;

  @Field(() => Float)
  grossPay: number;

  @Field(() => Float)
  totalDeductions: number;

  @Field(() => Float)
  netPay: number;

  @Field(() => Int)
  workingDays: number;

  @Field(() => Float)
  presentDays: number;

  @Field(() => Float)
  absentDays: number;

  @Field(() => Float)
  leaveDays: number;

  @Field(() => Float, { nullable: true })
  overtimeHours?: number;

  @Field(() => PayrollItemStatus)
  status: PayrollItemStatus;

  @Field({ nullable: true })
  paymentMethod?: string;

  @Field({ nullable: true })
  bankAccount?: string;

  @Field({ nullable: true })
  transactionRef?: string;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [PayrollItemComponent], { nullable: true })
  components?: PayrollItemComponent[];

  @Field(() => [PayslipAdjustment], { nullable: true })
  adjustments?: PayslipAdjustment[];
}

@ObjectType()
export class PayrollItemResponse extends BaseResponse(PayrollItem) {}

@ObjectType()
export class PayrollItemsQueryResponse extends BaseQueryResponse(PayrollItem) {}
