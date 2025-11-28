import { CreateLeaveSettingInput } from './create-leave-setting.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLeaveSettingInput extends PartialType(
  CreateLeaveSettingInput,
) {}
