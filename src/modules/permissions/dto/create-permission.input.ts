import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePermissionInput {
  @Field(() => String, {
    description: 'Resource for the permission',
  })
  resource: string;

  @Field(() => String, {
    description: 'Action to be performed on the resource',
  })
  action: string;
}
