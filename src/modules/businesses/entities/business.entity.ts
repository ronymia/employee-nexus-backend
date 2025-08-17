import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { BusinessStatus } from 'generated/prisma';

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
  long?: number | null;

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

  @Field(() => Int)
  subscriptionPlanId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
