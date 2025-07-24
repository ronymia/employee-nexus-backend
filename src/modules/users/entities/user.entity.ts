import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ROLE, USER_ACCOUNT_STATUS } from 'generated/prisma';

registerEnumType(ROLE, { name: 'ROLE', description: 'User roles' });
registerEnumType(USER_ACCOUNT_STATUS, {
  name: 'USER_ACCOUNT_STATUS',
  description: 'User account status',
});

@ObjectType('User')
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  password: string;

  @Field(() => ROLE)
  role: ROLE;

  @Field()
  passwordResetRequired: boolean;

  @Field(() => USER_ACCOUNT_STATUS)
  status: USER_ACCOUNT_STATUS;

  @Field(() => Int, { nullable: true })
  deletedBy: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
