import {
  Field,
  HideField,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { USER_ACCOUNT_STATUS } from 'generated/prisma';
import { Profile } from 'src/modules/profiles/entities/profile.entity';

registerEnumType(USER_ACCOUNT_STATUS, {
  name: 'USER_ACCOUNT_STATUS',
  description: 'User account status',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @HideField()
  password: string;

  @Field(() => Int)
  roleId: number;

  @Field(() => USER_ACCOUNT_STATUS)
  status: USER_ACCOUNT_STATUS;

  @Field(() => Profile, { nullable: true })
  profile?: Profile | null;

  @Field(() => Int, { nullable: true })
  deletedBy?: number | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
