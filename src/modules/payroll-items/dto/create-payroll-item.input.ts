import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreatePayrollItemInput {
  @Field(() => Int)
  @IsNumber()
  payrollCycleId: number;

  @Field(() => Int)
  @IsNumber()
  userId: number;

  // @Field(() => User, { description: 'User' })
  // user: User;

  @Field(() => Float)
  @IsNumber()
  basicSalary: number;

  // @Field(() => Float)
  // @IsNumber()
  // grossPay: number;

  // @Field(() => Float)
  // @IsNumber()
  // totalDeductions: number;

  // @Field(() => Float)
  // @IsNumber()
  // netPay: number;

  @Field(() => Int)
  @IsNumber()
  workingDays: number;

  @Field(() => Float)
  @IsNumber()
  presentDays: number;

  @Field(() => Float)
  @IsNumber()
  absentDays: number;

  @Field(() => Float)
  @IsNumber()
  leaveDays: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  overtimeHours?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  paymentMethod: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bankAccount?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  transactionRef?: string;
}
