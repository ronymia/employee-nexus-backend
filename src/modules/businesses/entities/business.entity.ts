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
  lat?: number;

  @Field(() => Float, { nullable: true })
  long?: number;

  @Field()
  registrationDate: Date;

  @Field({ nullable: true })
  website?: string;

  @Field(() => Int)
  numberOfEmployeesAllowed: number;

  @Field()
  isSubscribed: boolean;

  @Field()
  trailEndDate: Date;

  @Field(() => String)
  status: BusinessStatus;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  servicePlanId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
