import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { BusinessSchedule } from 'src/modules/business-schedules/entities/business-schedule.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BusinessStatus } from '../enums';
import { BusinessSubscription } from 'src/modules/business-subscriptions/entities/business-subscription.entity';

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

  @Field()
  registrationDate: Date;

  @Field(() => String, { nullable: true })
  website?: string | null;

  @Field(() => String)
  status: BusinessStatus;

  @Field(() => Int)
  ownerId: number;

  @Field(() => User, { nullable: true })
  owner?: User | null;

  @Field(() => [BusinessSchedule], { nullable: true })
  businessSchedules?: BusinessSchedule[] | null;

  @Field(() => BusinessSubscription)
  subscription: BusinessSubscription;

  @Field(() => [BusinessSubscription])
  subscriptions: BusinessSubscription[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class BusinessResponse extends BaseResponse(Business) {}

@ObjectType()
export class BusinessQueryResponse extends BaseQueryResponse(Business) {}
