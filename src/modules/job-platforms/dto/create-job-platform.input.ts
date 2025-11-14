import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateJobPlatformInput {
  @Field(() => String, { description: 'Name of the job platform' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the job platform' })
  @IsString()
  @IsOptional()
  description: string;
}
