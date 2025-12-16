import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateProfileInput } from './create-profile.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => ID)
  @IsInt()
  userId: number;
}
