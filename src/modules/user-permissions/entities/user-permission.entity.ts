import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class UserPermission {
  @Field(() => Int, { description: 'ID of the user' })
  userId?: number;

  @Field(() => User, { nullable: true })
  user?: User | null;

  @Field(() => Int, { description: 'ID of the permission' })
  permissionId?: number;

  @Field(() => Permission, { description: 'Permission details' })
  permission: Permission;
}
