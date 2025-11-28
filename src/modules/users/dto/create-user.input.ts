import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field(() => Int)
  roleId?: number;

  @Field(() => Int, { nullable: true })
  businessId?: number;
}
