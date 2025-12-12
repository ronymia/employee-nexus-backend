import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';
import { SubscriptionStatus } from '../enums';
import { IsEnum } from 'class-validator';

@ObjectType()
export class SubscriptionPlan {
  @Field(() => ID, { description: 'Unique identifier for the service plan' })
  id: number;

  @Field({ description: 'Name of the service plan' })
  name: string;

  @Field({ description: 'Description of the service plan' })
  description: string;

  @Field(() => Int, { description: 'One-time setup fee for the service plan' })
  setupFee: number;

  @Field(() => SubscriptionStatus, {
    description: 'Status of the service plan',
    defaultValue: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @Field(() => Int, { description: 'Price of the service plan' })
  price: number;

  // @Field(() => [Business], {
  //   description: 'Businesses using this service plan',
  // })
  // businesses: Business[];

  @Field(() => Int, { description: 'User who created the service plan' })
  createdBy: number;

  @Field(() => User, {
    nullable: true,
    description: 'Creator of the service plan',
  })
  creator?: User | null;

  @Field(() => Date, {
    description: 'Timestamp when the service plan was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Timestamp when the service plan was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class SubscriptionPlanResponse extends BaseResponse(SubscriptionPlan) {}

@ObjectType()
export class SubscriptionPlanQueryResponse extends BaseQueryResponse(
  SubscriptionPlan,
) {}
