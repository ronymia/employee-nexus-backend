import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { Business } from 'src/modules/businesses/entities/business.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { UserPermission } from 'src/modules/user-permissions/entities/user-permission.entity';
import { Employee } from './employee.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { UserAccountStatus } from '../enums';

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

  @Field(() => Int, {
    nullable: true,
    description: 'ID of the business (direct connection)',
  })
  businessId?: number | null;

  @Field(() => UserAccountStatus, {
    description: 'Status of the user account',
  })
  status: UserAccountStatus;

  @Field(() => Profile, { nullable: true })
  profile?: Profile | null;

  @Field(() => Business, { nullable: true })
  business: Business | null;

  @Field(() => [UserPermission], { nullable: true })
  userPermissions: UserPermission[] | null;

  @Field(() => Employee, { nullable: true })
  employee?: Employee | null;

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

@ObjectType()
export class UserResponse extends BaseResponse(User) {}

@ObjectType()
export class UsersQueryResponse extends BaseQueryResponse(User) {}
