import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdatePayrollItemInput {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  basicSalary?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  workingDays?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  presentDays?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  absentDays?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  leaveDays?: number;

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
  paymentMethod?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bankAccount?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  transactionRef?: string;
}
