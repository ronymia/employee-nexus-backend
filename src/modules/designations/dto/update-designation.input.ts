import { CreateDesignationInput } from './create-designation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDesignationInput extends PartialType(
  CreateDesignationInput,
) {
  @Field(() => Int)
  id: number;
}
