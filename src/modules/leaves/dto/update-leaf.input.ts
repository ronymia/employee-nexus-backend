import { CreateLeafInput } from './create-leaf.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLeafInput extends PartialType(CreateLeafInput) {
  @Field(() => Int)
  id: number;
}
