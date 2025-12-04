import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class ChangeMyPasswordInput {
  @Field(() => String, { description: 'User email' })
  @IsString({ message: 'Current Password cannot be empty' })
  currentPassword: string;

  @Field(() => String, { description: 'User password' })
  @IsString({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
