import { IsString } from 'class-validator';
import { CreateJobTypeInput } from './create-job-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateJobTypeInput extends PartialType(CreateJobTypeInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { description: 'Name of the job type' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the job type' })
  @IsString()
  description: string;
}
