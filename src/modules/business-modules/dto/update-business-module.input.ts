import { IsBoolean, IsInt } from 'class-validator';
import { CreateBusinessModuleInput } from './create-business-module.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBusinessModuleInput extends PartialType(
  CreateBusinessModuleInput,
) {
  @Field(() => Int, { description: 'Business ID' })
  @IsInt()
  businessId: number;

  @Field(() => Int, { description: 'System Module ID' })
  @IsInt()
  systemModuleId: number;

  @Field(() => Boolean, { description: 'Is Enabled' })
  @IsBoolean()
  isEnabled: boolean;
}
