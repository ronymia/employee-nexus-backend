import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLeafInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
