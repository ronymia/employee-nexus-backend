import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateJobTypeInput {
  @Field(() => String, { description: 'Name of the job type' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the job type' })
  @IsString()
  @IsOptional()
  description: string;
}
