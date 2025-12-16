import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsString, IsInt, IsOptional } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { Status } from 'src/common/enums';
import { LocationTrackingType } from '../enums/location-tracking-type.enum';

@InputType()
export class QueryWorkSiteInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  name?: string;

  @Field(() => Status, { nullable: true })
  @IsEnum(Status)
  status?: Status;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => LocationTrackingType, { nullable: true })
  @IsOptional()
  @IsEnum(LocationTrackingType)
  locationTrackingType?: LocationTrackingType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  maxRadius?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
