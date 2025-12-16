// EMPLOYMENT STATUS ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR EMPLOYMENT STATUS
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Status } from 'src/common/enums';

@ObjectType()
export class EmploymentStatus {
  @Field(() => ID, {
    description: 'Unique identifier for the employment status',
  })
  id: number;
  @Field(() => String, { description: 'Name of the employment status' })
  name: string;

  @Field(() => String, { description: 'Description of the employment status' })
  description: string;

  @Field(() => Status, { description: 'Status of the employment status' })
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, {
    description: 'Date when the employment status was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the employment status was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class EmploymentStatusResponse extends BaseResponse(EmploymentStatus) {}

@ObjectType()
export class EmploymentStatusesQueryResponse extends BaseQueryResponse(
  EmploymentStatus,
) {}
