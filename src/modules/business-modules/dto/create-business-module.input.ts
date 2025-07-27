import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBusinessModuleInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
