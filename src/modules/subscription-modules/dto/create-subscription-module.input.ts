import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateSubscriptionModuleInput {
  @Field(() => Int, { description: 'Subscription Plan ID' })
  @IsInt()
  subscriptionPlanId: number;

  @Field(() => Int, { description: 'Module ID' })
  @IsInt()
  moduleId: number;
}
