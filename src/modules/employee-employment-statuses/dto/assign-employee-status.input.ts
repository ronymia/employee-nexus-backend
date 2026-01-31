import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsDate,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class AssignEmployeeStatusInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'Employment Status ID to assign' })
  @IsInt()
  employmentStatusId: number;

  @Field(() => Date, { description: 'Start date of employment status' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'End date of employment status',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @Field(() => Boolean, {
    defaultValue: true,
    description: 'Whether this status is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => String, {
    nullable: true,
    description: 'Reason for status change',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @Field(() => String, { nullable: true, description: 'Additional remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}

@InputType()
export class UpdateEmployeeStatusInput extends AssignEmployeeStatusInput {}
