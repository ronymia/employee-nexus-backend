import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEmail, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateBusinessInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  country: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  postcode: string;

  @Field(() => Float, { nullable: true })
  @IsInt()
  lat?: number;

  @Field(() => Float, { nullable: true })
  @IsInt()
  long?: number;

  @Field()
  @IsDate()
  registrationDate: Date;

  @Field({ nullable: true })
  @IsString()
  website?: string;

  @Field(() => Int)
  @IsInt()
  numberOfEmployeesAllowed: number;

  @Field()
  @IsBoolean()
  isSubscribed: boolean;

  @Field()
  @IsDate()
  trailEndDate: Date;

  @Field(() => Int)
  @IsInt()
  subscriptionPlanId: number;
}
