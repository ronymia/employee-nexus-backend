import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginAuthInput {
  @Field(() => String, { description: 'User email' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field(() => String, { description: 'User password' })
  @IsString({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
