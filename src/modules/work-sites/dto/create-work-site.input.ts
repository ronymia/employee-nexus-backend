import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, IsEnum, IsNumber } from 'class-validator';
import { LocationTrackingType } from '../enums/location-tracking-type.enum';

@InputType()
export class CreateWorkSiteInput {
  @Field(() => String, { description: 'Name of the work site' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the work site' })
  @IsString()
  description: string;

  @Field(() => String, { description: 'Address of the work site' })
  @IsString()
  address?: string;

  @Field(() => Float, {
    nullable: true,
    description: 'Latitude for geo_fencing',
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Longitude for geo_fencing',
  })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @Field(() => LocationTrackingType, {
    nullable: true,
    description: 'Type of location tracking',
    defaultValue: LocationTrackingType.NONE,
  })
  @IsOptional()
  @IsEnum(LocationTrackingType)
  locationTrackingType?: LocationTrackingType;

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum radius in meters for geo_fencing',
  })
  @IsOptional()
  @IsInt()
  maxRadius?: number;

  @Field(() => String, {
    nullable: true,
    description: 'IP address for IP-based tracking',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
