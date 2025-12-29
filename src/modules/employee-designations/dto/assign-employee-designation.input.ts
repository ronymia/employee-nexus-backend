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
export class AssignEmployeeDesignationInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'Designation ID to assign' })
  @IsInt()
  designationId: number;

  @Field(() => Date, { description: 'Start date of designation' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true, description: 'End date of designation' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @Field(() => Int, { description: 'Salary for this designation' })
  @IsInt()
  salary: number;

  @Field(() => Boolean, {
    defaultValue: true,
    description: 'Whether this is the active designation',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => String, { nullable: true, description: 'Additional remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
