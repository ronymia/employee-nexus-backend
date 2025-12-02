import { CreateEducationHistoryInput } from './create-education-history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEducationHistoryInput extends PartialType(
  CreateEducationHistoryInput,
) {
  @Field(() => Int)
  id: number;
}
