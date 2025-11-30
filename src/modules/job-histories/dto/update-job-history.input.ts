import { CreateJobHistoryInput } from './create-job-history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateJobHistoryInput extends PartialType(CreateJobHistoryInput) {
  @Field(() => Int)
  id: number;
}
