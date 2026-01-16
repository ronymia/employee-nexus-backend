import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsEmail, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBusinessSubscriptionInput } from 'src/modules/business-subscriptions/dto/create-business-subscription.input';

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

  @Field(() => CreateBusinessSubscriptionInput, {
    description: 'Business Subscription Details',
  })
  subscription: CreateBusinessSubscriptionInput;
}
