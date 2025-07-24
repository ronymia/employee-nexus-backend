/* eslint-disable @typescript-eslint/no-unsafe-call */
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ROLE, USER_ACCOUNT_STATUS } from 'generated/prisma';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field(() => ROLE)
  @IsEnum(ROLE)
  role: ROLE;

  @Field(() => USER_ACCOUNT_STATUS)
  @IsEnum(USER_ACCOUNT_STATUS)
  status: USER_ACCOUNT_STATUS;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  deletedBy?: number;
}
