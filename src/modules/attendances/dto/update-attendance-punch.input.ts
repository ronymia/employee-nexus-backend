import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateAttendancePunchInput } from './create-attendance-punch.input';

@InputType()
export class UpdateAttendancePunchInput extends PartialType(
  CreateAttendancePunchInput,
) {
  @Field(() => Int)
  id: number;
}
