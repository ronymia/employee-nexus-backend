import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateFeatureInput {
  @Field(() => String, { description: 'Name of the module' })
  @IsString()
  name: string;
}
