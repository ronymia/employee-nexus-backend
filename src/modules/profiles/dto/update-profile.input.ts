import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateProfileInput } from './create-profile.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;
}
