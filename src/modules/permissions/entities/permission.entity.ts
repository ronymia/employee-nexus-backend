import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field(() => ID, { description: 'Unique identifier for the permission' })
  id?: number;

  @Field()
  resource: string;

  @Field()
  action: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
