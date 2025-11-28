import { ObjectType, Field, Int, registerEnumType, ID } from '@nestjs/graphql';
import { Status } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Work Site',
});

@ObjectType()
export class WorkSite {
  @Field(() => ID, { description: 'Unique identifier for the work site' })
  id: number;
  @Field(() => String, { description: 'Name of the work site' })
  name: string;

  @Field(() => String, { description: 'Description of the work site' })
  description: string;

  @Field(() => Status, { description: 'Status of the work site' })
  status: Status;

  @Field(() => String, {
    nullable: true,
    description: 'Address of the work site',
  })
  address?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether location is enabled',
  })
  isLocationEnabled?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether geo location is enabled',
  })
  isGeoLocationEnabled?: boolean;

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum radius for location',
  })
  maxRadius?: number;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether IP is enabled',
  })
  isIpEnabled?: boolean;

  @Field(() => String, { nullable: true, description: 'IP address' })
  ipAddress?: string;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, { description: 'Date when the work site was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the work site was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class WorkSiteResponse extends BaseResponse(WorkSite) {}

@ObjectType()
export class WorkSitesQueryResponse extends BaseQueryResponse(WorkSite) {}
