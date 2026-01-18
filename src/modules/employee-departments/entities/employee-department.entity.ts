import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Department } from 'src/modules/departments/entities/department.entity';
import { Employee } from 'src/modules/users/entities/employee.entity';

@ObjectType()
export class EmployeeDepartment {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Employee, { description: 'Employee relation' })
  employee: Employee;

  @Field(() => Int, { description: 'Department ID' })
  @IsInt()
  departmentId: number;

  @Field(() => Department, { description: 'Department relation' })
  department: Department;

  @Field(() => Date, { description: 'Start Date' })
  @IsDate()
  startDate: Date;

  @Field(() => Date, { nullable: true, description: 'End Date' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => Boolean, {
    description: 'Whether this is the primary department for the employee',
  })
  @IsBoolean()
  isPrimary: boolean;

  @Field(() => Boolean, {
    description: 'Whether this department assignment is currently active',
  })
  @IsBoolean()
  isActive: boolean;

  @Field(() => String, {
    description: 'Role in department (e.g., member, lead)',
  })
  @IsString()
  roleInDept: string;

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
export class EmployeeDepartmentResponse extends BaseResponse(
  EmployeeDepartment,
) {}

@ObjectType()
export class EmployeeDepartmentsArrayResponse extends BaseQueryResponse(
  EmployeeDepartment,
) {}
