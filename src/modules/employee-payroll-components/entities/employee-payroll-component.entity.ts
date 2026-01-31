import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';
import { PayrollComponent } from 'src/modules/payroll-components/entities/payroll-component.entity';

@ObjectType()
export class EmployeePayrollComponent {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => User, { nullable: true })
  employee?: User;

  @Field(() => Int)
  payrollComponentId: number;

  @Field(() => PayrollComponent, { nullable: true })
  payrollComponent?: PayrollComponent;

  @Field(() => Float, { nullable: true })
  value?: number;

  @Field(() => Date)
  effectiveFrom: Date;

  @Field(() => Date, { nullable: true })
  effectiveTo?: Date;

  @Field(() => Int, { nullable: true })
  assignedBy?: number;

  @Field(() => User, { nullable: true })
  assignedByUser?: User;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class EmployeePayrollComponentResponse extends BaseResponse(
  EmployeePayrollComponent,
) {}

@ObjectType()
export class EmployeePayrollComponentsQueryResponse extends BaseQueryResponse(
  EmployeePayrollComponent,
) {}
