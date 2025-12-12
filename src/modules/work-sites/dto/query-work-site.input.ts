import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
} from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { Status } from 'src/common/enums';

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

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isLocationEnabled?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isGeoLocationEnabled?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  maxRadius?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isIpEnabled?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
