import { CreateJobTypeInput } from './create-job-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateJobTypeInput extends PartialType(CreateJobTypeInput) {
  @Field(() => Int)
  id: number;
}
