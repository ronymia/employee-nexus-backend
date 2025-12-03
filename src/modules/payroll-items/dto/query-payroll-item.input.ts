import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PayrollItemStatus } from '../enums/payroll-item-status.enum';

@InputType()
export class QueryPayrollItemInput {
  @Field(() => Int)
  @IsNumber()
  payrollCycleId: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @Field(() => PayrollItemStatus, { nullable: true })
  @IsEnum(PayrollItemStatus)
  @IsOptional()
  status?: PayrollItemStatus;
}
