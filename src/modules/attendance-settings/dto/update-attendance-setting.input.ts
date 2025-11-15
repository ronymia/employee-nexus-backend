import { CreateAttendanceSettingInput } from './create-attendance-setting.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAttendanceSettingInput extends PartialType(
  CreateAttendanceSettingInput,
) {}
