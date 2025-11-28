import { CreateRecruitmentProcessInput } from './create-recruitment-process.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRecruitmentProcessInput extends PartialType(
  CreateRecruitmentProcessInput,
) {
  @Field(() => Int)
  id: number;
}
