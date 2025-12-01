import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Leaf {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
