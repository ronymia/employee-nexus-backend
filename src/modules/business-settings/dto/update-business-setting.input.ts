import { CreateBusinessSettingInput } from './create-business-setting.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBusinessSettingInput extends PartialType(
  CreateBusinessSettingInput,
) {
  @Field(() => Int)
  id: number;
}
