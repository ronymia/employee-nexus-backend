import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRolePermissionInput {
  @Field(() => Int, { description: 'ID of the role' })
  roleId: number;

  @Field(() => Int, { description: 'ID of the permission' })
  permissionId: number;
}
