import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateDesignationInput {
  @Field(() => String, { description: 'Name of the designation' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the designation' })
  @IsString()
  description: string;
}
