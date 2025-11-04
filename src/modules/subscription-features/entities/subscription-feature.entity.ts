import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SubscriptionPlan } from 'src/modules/subscription-plans/entities/subscription-plan.entity';
import { Feature } from 'src/modules/features/entities/features.entity';

@ObjectType()
export class SubscriptionFeature {
  @Field(() => Int, { description: 'Service Plan ID' })
  subscriptionPlanId: number;

  @Field(() => SubscriptionPlan, { description: 'Service Plan Details' })
  subscriptionPlan: SubscriptionPlan;

  @Field(() => Int, { description: 'Feature ID' })
  featureId: number;

  @Field(() => Feature, { description: 'Feature Details' })
  feature: Feature;
}
