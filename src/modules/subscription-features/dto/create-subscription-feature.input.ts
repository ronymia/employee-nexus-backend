import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateSubscriptionFeatureInput {
  @Field(() => Int, { description: 'Subscription Plan ID' })
  @IsInt()
  subscriptionPlanId: number;

  @Field(() => Int, { description: 'Feature ID' })
  @IsInt()
  FeatureId: number;
}
