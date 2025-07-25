import { CreateUserPermissionInput } from './create-user-permission.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserPermissionInput extends PartialType(
  CreateUserPermissionInput,
) {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { description: 'ID of the user' })
  userId: number;

  @Field(() => Int, { description: 'ID of the permission' })
  permissionId: number;
}
