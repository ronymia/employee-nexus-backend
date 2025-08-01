import { CreateSubscriptionModuleInput } from './create-subscription-module.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubscriptionModuleInput extends PartialType(
  CreateSubscriptionModuleInput,
) {
  @Field(() => Int)
  id: number;
}
