import {
  ObjectType,
  Field,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';

// Define SalaryType enum for GraphQL
export enum SalaryType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
}

// Register enum for GraphQL
registerEnumType(SalaryType, {
  name: 'SalaryType',
  description: 'Type of salary payment',
});

@ObjectType()
export class EmployeeSalary {
  @Field(() => Int, { description: 'Unique identifier for the salary record' })
  id: number;

  @Field(() => Int, { description: 'User ID of the employee' })
  userId: number;

  @Field(() => User, {
    nullable: true,
    description: 'Employee user details',
  })
  user?: User;

  @Field(() => Float, { description: 'Salary amount' })
  salaryAmount: number;

  @Field(() => SalaryType, {
    description: 'Type of salary (HOURLY, DAILY, MONTHLY)',
  })
  salaryType: SalaryType;

  @Field(() => Date, { description: 'Start date of the salary' })
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'End date of the salary',
  })
  endDate?: Date;

  @Field(() => Boolean, {
    description: 'Whether this salary is currently active',
    defaultValue: true,
  })
  isActive: boolean;

  @Field(() => String, {
    nullable: true,
    description: 'Reason for salary change (e.g., Annual Increment, Promotion)',
  })
  reason?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Additional remarks about the salary',
  })
  remarks?: string;

  @Field(() => Date, { description: 'Date when the salary record was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the salary record was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class EmployeeSalaryResponse extends BaseResponse(EmployeeSalary) {}

@ObjectType()
export class EmployeeSalariesQueryResponse extends BaseQueryResponse(
  EmployeeSalary,
) {}
