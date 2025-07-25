import { CreatePermissionInput } from './create-permission.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
  @Field(() => ID, { description: 'Unique identifier for the permission' })
  id: number;

  @Field(() => String, {
    description: 'Resource for the permission',
  })
  resource: string;

  @Field(() => String, {
    description: 'Action to be performed on the resource',
  })
  action: string;
}
