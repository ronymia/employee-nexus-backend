/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { BusinessStatus } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { BusinessSchedule } from 'src/modules/business-schedules/entities/business-schedule.entity';
import { SubscriptionPlan } from 'src/modules/subscription-plans/entities/subscription-plan.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Business {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  postcode: string;

  @Field(() => Float, { nullable: true })
  lat?: number | null;

  @Field(() => Float, { nullable: true })
  lng?: number | null;

  @Field()
  registrationDate: string;

  @Field(() => String, { nullable: true })
  website?: string | null;

  @Field(() => Int)
  numberOfEmployeesAllowed: number;

  @Field(() => String)
  status: BusinessStatus;

  @Field(() => Int)
  userId: number;

  @Field(() => User, { nullable: true })
  owner?: User | null;

  @Field(() => [BusinessSchedule], { nullable: true })
  businessSchedules?: BusinessSchedule[] | null;

  @Field(() => Int)
  subscriptionPlanId: number;

  @Field(() => SubscriptionPlan, { nullable: true })
  subscriptionPlan?: SubscriptionPlan;
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class BusinessResponse extends BaseResponse(Business) {}

@ObjectType()
export class BusinessQueryResponse extends BaseQueryResponse(Business) {}
