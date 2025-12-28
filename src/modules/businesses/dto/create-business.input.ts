import { InputType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsEmail, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

  @Field()
  @IsDate()
  @Type(() => Date)
  registrationDate: Date;

  @Field(() => Int)
  @IsInt()
  numberOfEmployeesAllowed: number;

  @Field(() => Int)
  @IsInt()
  subscriptionPlanId: number;
}
