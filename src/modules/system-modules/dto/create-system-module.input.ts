import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateSystemModuleInput {
  @Field(() => String, { description: 'Name of the module' })
  @IsString()
  name: string;
}
