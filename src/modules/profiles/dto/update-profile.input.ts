import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { CreateProfileInput } from './create-profile.input';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => Int, { description: 'ID of the profile to update' })
  id: number;
}
