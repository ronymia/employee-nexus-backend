import { InputType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateBusinessSubscriptionInput {
  @Field(() => Int, { description: 'ID of the business' })
  @IsInt()
  businessId: number;

  @Field(() => Int, { description: 'ID of the subscription plan' })
  @IsInt()
  subscriptionPlanId: number;

  @Field(() => Date, {
    description: 'Trial end date',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  trialEndDate?: Date;

  @Field(() => Date, {
    description: 'Subscription start date',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field(() => Date, {
    description: 'Subscription end date',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => String, { description: 'Status of the subscription' })
  @IsString()
  status: string;
}
