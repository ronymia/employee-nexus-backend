import { CreateBusinessSettingInput } from './create-business-setting.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBusinessSettingInput extends PartialType(
  CreateBusinessSettingInput,
) {}
