import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Status } from 'src/common/enums';

@ObjectType()
export class RecruitmentProcess {
  @Field(() => ID, {
    description: 'Unique identifier for the recruitment process',
  })
  id: number;
  @Field(() => String, { description: 'Name of the recruitment process' })
  name: string;

  @Field(() => String, {
    description: 'Description of the recruitment process',
  })
  description: string;

  @Field(() => Status, { description: 'Status of the recruitment process' })
  status: Status;

  @Field(() => Boolean, {
    description: 'Whether the recruitment process is required',
  })
  isRequired: boolean;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, {
    description: 'Date when the recruitment process was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the recruitment process was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class RecruitmentProcessResponse extends BaseResponse(
  RecruitmentProcess,
) {}

@ObjectType()
export class RecruitmentProcessesQueryResponse extends BaseQueryResponse(
  RecruitmentProcess,
) {}
