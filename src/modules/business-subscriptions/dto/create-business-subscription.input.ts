import { InputType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsEnum, IsInt, IsOptional } from 'class-validator';
import { BusinessSubscriptionStatus } from 'src/modules/subscription-plans/enums';

@InputType()
export class CreateBusinessSubscriptionInput {
  @Field(() => Int, { description: 'Number of employees allowed' })
  @IsInt()
  numberOfEmployeesAllowed: number;

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
  })
  @IsDate()
  startDate: Date;

  @Field(() => Date, {
    description: 'Subscription end date',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
