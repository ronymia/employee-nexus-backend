import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class BusinessModule {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
