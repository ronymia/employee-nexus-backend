import { CreateBusinessModuleInput } from './create-business-module.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBusinessModuleInput extends PartialType(
  CreateBusinessModuleInput,
) {
  @Field(() => Int)
  id: number;
}
