import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsBoolean, IsEnum } from 'class-validator';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { SubscriptionPlan } from 'src/modules/subscription-plans/entities/subscription-plan.entity';
import { BusinessSubscriptionStatus } from 'generated/prisma';

@ObjectType()
export class BusinessSubscription {
  @Field(() => ID, {
    description: 'Unique identifier for the business subscription',
  })
  @IsInt()
  id: number;

  @Field(() => Int, { description: 'ID of the business' })
  @IsInt()
  businessId: number;

  @Field(() => Int, { description: 'ID of the subscription plan' })
  @IsInt()
  subscriptionPlanId: number;

  @Field(() => SubscriptionPlan, { description: 'Subscription plan details' })
  subscriptionPlan: SubscriptionPlan;

  @Field(() => Date, {
    description: 'Trial end date',
    nullable: true,
  })
  @IsDate()
  trialEndDate?: Date;

  @Field(() => Date, {
    description: 'Subscription start date',
    nullable: true,
  })
  @IsDate()
  startDate?: Date;

  @Field(() => Date, {
    description: 'Subscription end date',
    nullable: true,
  })
  @IsDate()
  endDate?: Date;

  @Field(() => BusinessSubscriptionStatus, {
    description: 'Status of the subscription',
  })
  @IsEnum(BusinessSubscriptionStatus)
  status: BusinessSubscriptionStatus;

  @Field(() => Boolean, { description: 'Whether the subscription is active' })
  @IsBoolean()
  isActive: boolean;

  @Field(() => Int, {
    description: 'Number of employees allowed in this subscription',
  })
  @IsInt()
  numberOfEmployeesAllowed: number;

  @Field(() => Date, {
    description: 'Date when the subscription was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the subscription was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class BusinessSubscriptionResponse extends BaseResponse(
  BusinessSubscription,
) {}

@ObjectType()
export class BusinessSubscriptionsQueryResponse extends BaseQueryResponse(
  BusinessSubscription,
) {}
