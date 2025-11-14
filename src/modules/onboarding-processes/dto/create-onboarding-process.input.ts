import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class CreateOnboardingProcessInput {
  @Field(() => String, { description: 'Name of the onboarding process' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the onboarding process' })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Boolean, {
    description: 'Whether the onboarding process is required',
  })
  @IsBoolean()
  isRequired: boolean;
}
