import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PayrollItemStatus } from '../enums/payroll-item-status.enum';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';
import { IsOptional } from 'class-validator';
import { PayslipAdjustment } from 'src/modules/employee-payslip-adjustments/entities/payslip-adjustment.entity';
import { PayrollCycle } from 'src/modules/payroll-cycles/entities/payroll-cycle.entity';
import { PayrollItemComponent } from './payroll-item-component.entity';

@ObjectType()
export class PayrollItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  payrollCycleId: number;

  @Field(() => PayrollCycle, { description: 'Payroll Cycle' })
  payrollCycle: PayrollCycle;

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
  overtimeMinutes?: number;

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

  @Field(() => [PayslipAdjustment], {
    nullable: true,
    description: 'Payroll Adjustments',
  })
  @IsOptional()
  payslipAdjustments?: PayslipAdjustment[] | [];

  @Field(() => [PayrollItemComponent], {
    nullable: true,
    description:
      'Payroll Item Components - frozen snapshot of components used in calculation',
  })
  @IsOptional()
  payrollItemComponents?: PayrollItemComponent[] | [];
}

@ObjectType()
export class PayrollItemResponse extends BaseResponse(PayrollItem) {}

@ObjectType()
export class PayrollItemsQueryResponse extends BaseQueryResponse(PayrollItem) {}
