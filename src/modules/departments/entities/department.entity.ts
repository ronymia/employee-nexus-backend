// DEPARTMENT ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR DEPARTMENT
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';
import { Business } from 'src/modules/businesses/entities/business.entity';
import { Status } from 'src/common/enums';

@ObjectType()
export class Department {
  @Field(() => ID, {
    description: 'Unique identifier for the department',
  })
  id: number;

  @Field(() => String, { description: 'Name of the department' })
  name: string;

  @Field(() => String, { description: 'Description of the department' })
  description: string;

  @Field(() => Status, { description: 'Status of the department' })
  status: Status;

  @Field(() => Int, {
    description: 'ID of the parent department',
    nullable: true,
  })
  parentId?: number;

  @Field(() => Department, { description: 'Parent department', nullable: true })
  parent?: Department;

  @Field(() => [Department], {
    description: 'Child departments',
    nullable: true,
  })
  children?: Department[];

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Business, { description: 'Business this department belongs to' })
  business: Business;

  @Field(() => Int, { description: 'ID of the manager', nullable: true })
  managerId?: number;

  @Field(() => User, {
    description: 'Manager of the department',
    nullable: true,
  })
  manager?: User;

  @Field(() => Date, {
    description: 'Date when the department was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the department was last updated',
  })
  updatedAt: Date;

  @Field(() => Boolean, {
    description: 'Whether this department is set as default in SystemDefaults',
  })
  isDefault: boolean;
}

@ObjectType()
export class DepartmentResponse extends BaseResponse(Department) {}

@ObjectType()
export class DepartmentsQueryResponse extends BaseQueryResponse(Department) {}
