import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class CreateRecruitmentProcessInput {
  @Field(() => String, { description: 'Name of the recruitment process' })
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'Description of the recruitment process',
  })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Boolean, {
    description: 'Whether the recruitment process is required',
  })
  @IsBoolean()
  isRequired: boolean;
}
