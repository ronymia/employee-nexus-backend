import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

@ObjectType()
export class RolePermission {
  @Field(() => Int, { description: 'ID of the role' })
  roleId?: number;

  @Field(() => Role, { nullable: true })
  role?: Role | null;

  @Field(() => Permission, { description: 'ID of the permission' })
  permission?: Permission | null;

  @Field(() => Int, { description: 'ID of the permission' })
  permissionId?: number;
}
