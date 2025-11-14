import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

@InputType()
export class CreateWorkSiteInput {
  @Field(() => String, { description: 'Name of the work site' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the work site' })
  @IsString()
  description: string;

  @Field(() => String, {
    nullable: true,
    description: 'Address of the work site',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether location is enabled',
  })
  @IsOptional()
  @IsBoolean()
  isLocationEnabled?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether geo location is enabled',
  })
  @IsOptional()
  @IsBoolean()
  isGeoLocationEnabled?: boolean;

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum radius for location',
  })
  @IsOptional()
  @IsInt()
  maxRadius?: number;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether IP is enabled',
  })
  @IsOptional()
  @IsBoolean()
  isIpEnabled?: boolean;

  @Field(() => String, { nullable: true, description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
