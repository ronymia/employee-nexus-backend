import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { RolePermission } from 'src/modules/role-permissions/entities/role-permission.entity';

@ObjectType()
export class Role {
  @Field(() => ID, { description: 'Unique identifier for the role' })
  id: number;

  @Field(() => String, { description: 'Name of the role' })
  name: string;

  @Field(() => Int, { nullable: true, description: 'ID of the business' })
  businessId: number | null;

  @Field(() => [RolePermission], { nullable: true })
  rolePermissions: RolePermission[] | null;
}
