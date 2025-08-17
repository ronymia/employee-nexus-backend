import {
  Field,
  HideField,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { USER_ACCOUNT_STATUS } from 'generated/prisma';
import { Business } from 'src/modules/businesses/entities/business.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

registerEnumType(USER_ACCOUNT_STATUS, {
  name: 'USER_ACCOUNT_STATUS',
  description: 'User account status',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field(() => String, { description: 'Email of the user' })
  email: string;

  @HideField()
  password: string;

  @Field(() => Int, { nullable: true, description: 'ID of the role' })
  roleId: number | null;

  @Field(() => Role, { nullable: true, description: 'Role of the user' })
  role?: Role | null;

  @Field(() => USER_ACCOUNT_STATUS, {
    description: 'Status of the user account',
  })
  status: USER_ACCOUNT_STATUS;

  @Field(() => Profile, { nullable: true })
  profile?: Profile | null;

  @Field(() => Business, { nullable: true })
  business: Business | null;

  @Field(() => Int, {
    nullable: true,
    description: 'ID of the user who deleted the user account',
  })
  deletedBy?: number | null;

  @Field(() => Date, { description: 'Date when the user was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date when the user was last updated' })
  updatedAt: Date;
}
