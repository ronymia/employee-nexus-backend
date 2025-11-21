import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AssetType } from '../../asset-types/entities/asset-type.entity';
import { Business } from '../../businesses/entities/business.entity';
import { User } from '../../users/entities/user.entity';
import { AssetAssignment } from './asset-assignment.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from '../../../common/dto/base-response.type';

@ObjectType()
export class Asset {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  date: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Int, { nullable: true })
  assetTypeId?: number;

  @Field(() => AssetType, { nullable: true })
  assetType?: AssetType;

  @Field({ nullable: true })
  image?: string;

  @Field()
  status: string;

  @Field(() => Int, { nullable: true })
  businessId?: number;

  @Field(() => Business, { nullable: true })
  business?: Business;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [AssetAssignment])
  assetAssignments: AssetAssignment[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class AssetResponse extends BaseResponse(Asset) {}

@ObjectType()
export class AssetsQueryResponse extends BaseQueryResponse(Asset) {}

@ObjectType()
export class AssetAssignmentResponse extends BaseResponse(AssetAssignment) {}
