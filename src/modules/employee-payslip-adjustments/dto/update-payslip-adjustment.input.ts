import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { CreatePayslipAdjustmentInput } from './create-payslip-adjustment.input';
import { AdjustmentStatus } from '../enums/adjustment-status.enum';

@InputType()
export class QueryPayslipAdjustmentInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  userId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  payrollComponentId?: number;

  @Field(() => AdjustmentStatus, { nullable: true })
  @IsEnum(AdjustmentStatus)
  @IsOptional()
  status?: AdjustmentStatus;
}

@InputType()
export class UpdatePayslipAdjustmentInput extends CreatePayslipAdjustmentInput {
  @Field(() => Int)
  @IsInt()
  id: number;
}

@InputType()
export class ApproveRejectPayslipAdjustmentInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => AdjustmentStatus)
  @IsEnum(AdjustmentStatus)
  status: AdjustmentStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  notes?: string;
}
