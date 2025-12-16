import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Status } from 'src/common/enums';

@ObjectType()
export class JobType {
  @Field(() => ID, { description: 'Unique identifier for the job type' })
  id: number;
  @Field(() => String, { description: 'Name of the job type' })
  name: string;

  @Field(() => String, { description: 'Description of the job type' })
  description: string;

  @Field(() => Status, { description: 'Status of the job type' })
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, { description: 'Date when the job type was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the job type was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class JobTypeResponse extends BaseResponse(JobType) {}

@ObjectType()
export class JobTypesQueryResponse extends BaseQueryResponse(JobType) {}
