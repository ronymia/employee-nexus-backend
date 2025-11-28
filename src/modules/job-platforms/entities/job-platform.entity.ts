import { ObjectType, Field, Int, registerEnumType, ID } from '@nestjs/graphql';
import { Status } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Job Platform',
});

@ObjectType()
export class JobPlatform {
  @Field(() => ID, { description: 'Unique identifier for the job platform' })
  id: number;
  @Field(() => String, { description: 'Name of the job platform' })
  name: string;

  @Field(() => String, { description: 'Description of the job platform' })
  description: string;

  @Field(() => Status, { description: 'Status of the job platform' })
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, { description: 'Date when the job platform was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the job platform was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class JobPlatformResponse extends BaseResponse(JobPlatform) {}

@ObjectType()
export class JobPlatformsQueryResponse extends BaseQueryResponse(JobPlatform) {}
