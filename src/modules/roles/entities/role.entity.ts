import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field(() => ID, { description: 'Unique identifier for the role' })
  id: number;

  @Field(() => String, { description: 'Name of the role' })
  name: string;
}
