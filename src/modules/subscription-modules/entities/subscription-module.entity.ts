import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Module } from 'src/modules/modules/entities/module.entity';
import { SubscriptionPlan } from 'src/modules/subscription-plans/entities/subscription-plan.entity';

@ObjectType()
export class SubscriptionModule {
  @Field(() => Int, { description: 'Service Plan ID' })
  subscriptionPlanId: number;

  @Field(() => SubscriptionPlan, { description: 'Service Plan Details' })
  subscriptionPlan: SubscriptionPlan;

  @Field(() => Int, { description: 'System Module ID' })
  moduleId: number;

  @Field(() => Module, { description: 'System Module Details' })
  Module: Module;
}
