import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PayrollItemStatus } from '../enums/payroll-item-status.enum';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';
import { IsOptional } from 'class-validator';
import { EmployeePayrollComponent } from 'src/modules/employee-payroll-components/entities/employee-payroll-component.entity';
import { PayslipAdjustment } from 'src/modules/employee-payslip-adjustments/entities/payslip-adjustment.entity';

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

  @Field(() => [EmployeePayrollComponent], {
    nullable: true,
    description: 'Payroll Components',
  })
  @IsOptional()
  payrollComponents?: EmployeePayrollComponent[] | [];

  @Field(() => [PayslipAdjustment], {
    nullable: true,
    description: 'Payroll Adjustments',
  })
  @IsOptional()
  payrollAdjustments?: PayslipAdjustment[] | [];
}

@ObjectType()
export class PayrollItemResponse extends BaseResponse(PayrollItem) {}

@ObjectType()
export class PayrollItemsQueryResponse extends BaseQueryResponse(PayrollItem) {}
