import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { BaseResponse } from 'src/common/dto/base-response.type';
import { Designation } from 'src/modules/designations/entities/designation.entity';
import { Employee } from 'src/modules/users/entities/employee.entity';

@ObjectType()
export class EmployeeDesignation {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Employee, { description: 'Employee relation' })
  employee: Employee;

  @Field(() => Int, { description: 'Designation ID' })
  @IsInt()
  designationId: number;

  @Field(() => Designation)
  designation: Designation;

  @Field(() => Date, { description: 'Start Date' })
  @IsDate()
  startDate: Date;

  @Field(() => Date, { nullable: true, description: 'End Date' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => Int, { description: 'Salary of employee' })
  @IsInt()
  salary: number;

  @Field(() => Boolean, {
    description: 'true refer current active designation of employee',
  })
  @IsBoolean()
  isActive: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  remarks?: string;

  @Field(() => Date, { description: 'Created timestamp' })
  @IsDate()
  createdAt: Date;

  @Field(() => Date, { description: 'Updated timestamp' })
  @IsDate()
  updatedAt: Date;
}

@ObjectType()
export class EmployeeDesignationResponse extends BaseResponse(
  EmployeeDesignation,
) {}
