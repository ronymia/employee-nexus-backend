import { CreateSubscriptionFeatureInput } from './create-subscription-feature.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubscriptionFeatureInput extends PartialType(
  CreateSubscriptionFeatureInput,
) {
  @Field(() => Int)
  id: number;
}
