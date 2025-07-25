import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserPermissionInput {
  @Field(() => Int, { description: 'ID of the user' })
  userId: number;

  @Field(() => Int, { description: 'ID of the permission' })
  permissionId: number;
}
