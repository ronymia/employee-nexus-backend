import { IsString } from 'class-validator';
import { CreateSystemModuleInput } from './create-system-module.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSystemModuleInput extends PartialType(
  CreateSystemModuleInput,
) {
  @Field(() => String, { description: 'Name of the system module' })
  @IsString()
  name: string;
}
