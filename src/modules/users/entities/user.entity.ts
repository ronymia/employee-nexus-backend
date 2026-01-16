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

  @Field(() => Date, { description: 'Date when the user was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date when the user was last updated' })
  updatedAt: Date;
}

@ObjectType()
export class UserResponse extends BaseResponse(User) {}

@ObjectType()
export class UsersQueryResponse extends BaseQueryResponse(User) {}

@ObjectType()
export class UserStatistics {
  @Field(() => Int, { description: 'Total number of users' })
  totalUsers: number;

  @Field(() => Int, { description: 'Total number of employees' })
  totalEmployees: number;

  @Field(() => Int, { description: 'Total number of managers' })
  totalManagers: number;

  @Field(() => Int, { description: 'Total number of admins' })
  totalAdmins: number;

  @Field(() => Int, { description: 'Number of active users' })
  activeUsers: number;

  @Field(() => Int, { description: 'Number of inactive users' })
  inactiveUsers: number;

  @Field(() => Int, { description: 'Number of blocked users' })
  blockedUsers: number;

  @Field(() => Int, { description: 'Number of deleted users' })
  deletedUsers: number;

  @Field(() => Int, { description: 'Number of suspended users' })
  suspendedUsers: number;

  @Field(() => Int, { description: 'Number of verified users' })
  verifiedUsers: number;

  @Field(() => Int, { description: 'Number of unverified users' })
  unverifiedUsers: number;

  @Field(() => Int, { description: 'Number of terminated users' })
  terminatedUsers: number;

  @Field(() => Int, { description: 'Number of resigned users' })
  resignedUsers: number;

  @Field(() => Int, { description: 'Number of retired users' })
  retiredUsers: number;

  @Field(() => Int, { description: 'Number of users on leave' })
  onLeaveUsers: number;
}

@ObjectType()
export class UserStatisticsResponse extends BaseResponse(UserStatistics) {}
