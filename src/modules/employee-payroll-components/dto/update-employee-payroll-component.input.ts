import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { AssignEmployeePayrollComponentInput } from './create-employee-payroll-component.input';

@InputType()
export class QueryEmployeePayrollComponentInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  userId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  componentId?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class UpdateEmployeePayrollComponentInput extends AssignEmployeePayrollComponentInput {
  @Field(() => Int)
  @IsInt()
  id: number;
}
