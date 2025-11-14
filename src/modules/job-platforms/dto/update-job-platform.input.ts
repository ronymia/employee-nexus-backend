import { CreateJobPlatformInput } from './create-job-platform.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateJobPlatformInput extends PartialType(
  CreateJobPlatformInput,
) {
  @Field(() => Int)
  id: number;
}
