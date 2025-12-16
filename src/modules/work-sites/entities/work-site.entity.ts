import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Status } from 'src/common/enums';
import { LocationTrackingType } from '../enums/location-tracking-type.enum';

@ObjectType()
export class WorkSite {
  @Field(() => ID, { description: 'Unique identifier for the work site' })
  id: number;

  @Field(() => String, { description: 'Name of the work site' })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Description of the work site',
  })
  description?: string;

  @Field(() => Status, { description: 'Status of the work site' })
  status: Status;

  @Field(() => String, {
    nullable: true,
    description: 'Address of the work site',
  })
  address?: string;

  @Field(() => Float, {
    nullable: true,
    description: 'Latitude for geo_fencing',
  })
  lat?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Longitude for geo_fencing',
  })
  lng?: number;

  @Field(() => LocationTrackingType, {
    description: 'Type of location tracking',
    defaultValue: LocationTrackingType.NONE,
  })
  locationTrackingType: LocationTrackingType;

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum radius in meters for geo_fencing',
  })
  maxRadius?: number;

  @Field(() => String, {
    nullable: true,
    description: 'IP address for IP-based tracking',
  })
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
