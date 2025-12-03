import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PayrollCycleStatus } from '../enums/payroll-cycle-status.enum';

@InputType()
export class QueryPayrollCycleInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Business ID to filter payroll cycles',
  })
  @IsNumber()
  @IsOptional()
  businessId?: number;

  @Field(() => PayrollCycleStatus, { nullable: true })
  @IsEnum(PayrollCycleStatus)
  @IsOptional()
  status?: PayrollCycleStatus;
}
