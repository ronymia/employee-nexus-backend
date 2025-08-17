import { IsString } from 'class-validator';
import { CreateDesignationInput } from './create-designation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDesignationInput extends PartialType(
  CreateDesignationInput,
) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { description: 'Name of the designation' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the designation' })
  @IsString()
  description: string;
}
