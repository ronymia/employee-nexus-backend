import { CreateOnboardingProcessInput } from './create-onboarding-process.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOnboardingProcessInput extends PartialType(
  CreateOnboardingProcessInput,
) {
  @Field(() => Int)
  id: number;
}
