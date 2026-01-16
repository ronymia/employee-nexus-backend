import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { BaseResponse } from 'src/common/dto/base-response.type';
import { EmploymentStatus } from 'src/modules/employment-status/entities/employment-status.entity';
import { Employee } from 'src/modules/users/entities/employee.entity';

@ObjectType()
export class EmployeeEmploymentStatus {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Employee, { description: 'Employee relation' })
  employee: Employee;

  @Field(() => Int, { description: 'Employment Status ID' })
  @IsInt()
  employmentStatusId: number;

  @Field(() => EmploymentStatus, { description: 'Employment Status relation' })
  employmentStatus: EmploymentStatus;

  @Field(() => Date, { description: 'Start Date' })
  @IsDate()
  startDate: Date;

  @Field(() => Date, { nullable: true, description: 'End Date' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => Boolean, {
    description: 'Whether this employment status is currently active',
  })
  @IsBoolean()
  isActive: boolean;

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

  @Field(() => Date, { description: 'Created timestamp' })
  @IsDate()
  createdAt: Date;

  @Field(() => Date, { description: 'Updated timestamp' })
  @IsDate()
  updatedAt: Date;
}

@ObjectType()
export class EmployeeEmploymentStatusResponse extends BaseResponse(
  EmployeeEmploymentStatus,
) {}
