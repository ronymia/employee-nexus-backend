import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsString } from 'class-validator';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Status } from 'src/common/enums';

@ObjectType()
export class Designation {
  @Field(() => ID, { description: 'Unique identifier for the designation' })
  @IsInt()
  id: number;

  @Field(() => String, { description: 'Name of the designation' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the designation' })
  @IsString()
  description: string;

  @Field(() => Status, { description: 'Status of the designation' })
  @IsEnum(Status)
  status: Status;

  @Field(() => Int, { description: 'ID of the business' })
  @IsInt()
  businessId: number;

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
