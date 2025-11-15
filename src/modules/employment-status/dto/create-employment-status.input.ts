// CREATE EMPLOYMENT STATUS INPUT - DEFINES THE STRUCTURE FOR CREATING NEW EMPLOYMENT STATUS RECORDS
import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateEmploymentStatusInput {
  @Field(() => String, { description: 'Name of the employment status' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the employment status' })
  @IsString()
  description: string;
}
