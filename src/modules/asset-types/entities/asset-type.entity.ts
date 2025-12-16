import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Status } from 'src/common/enums';

@ObjectType()
export class AssetType {
  @Field(() => ID, { description: 'Unique identifier for the asset type' })
  id: number;

  @Field(() => String, { description: 'Name of the asset type' })
  name: string;

  @Field(() => String, { description: 'Description of the asset type' })
  description: string;

  @Field(() => Status, { description: 'Status of the asset type' })
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, { description: 'Date when the asset type was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the asset type was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class AssetTypeResponse extends BaseResponse(AssetType) {}

@ObjectType()
export class AssetTypesQueryResponse extends BaseQueryResponse(AssetType) {}
