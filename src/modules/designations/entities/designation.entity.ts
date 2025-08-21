import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql';
import { Status } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Designation',
});
@ObjectType()
export class Designation {
  @Field(() => ID, { description: 'Unique identifier for the designation' })
  id: number;
  @Field(() => String, { description: 'Name of the designation' })
  name: string;

  @Field(() => String, { description: 'Description of the designation' })
  description: string;

  @Field(() => Status, { description: 'Status of the designation' })
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, { description: 'Date when the designation was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the designation was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class DesignationResponse extends BaseResponse(Designation) {}

@ObjectType()
export class DesignationsQueryResponse extends BaseQueryResponse(Designation) {}
