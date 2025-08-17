import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SubscriptionPlan } from 'src/modules/subscription-plans/entities/subscription-plan.entity';
import { SystemModule } from 'src/modules/system-modules/entities/system-module.entity';

@ObjectType()
export class SubscriptionModule {
  @Field(() => Int, { description: 'Service Plan ID' })
  subscriptionPlanId: number;

  @Field(() => SubscriptionPlan, { description: 'Service Plan Details' })
  subscriptionPlan: SubscriptionPlan;

  @Field(() => Int, { description: 'System Module ID' })
  moduleId: number;

  @Field(() => SystemModule, { description: 'System Module Details' })
  systemModule: SystemModule;
}
