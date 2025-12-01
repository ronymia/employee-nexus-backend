import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAttendancePunchInput extends PartialType(
  require('./create-attendance-punch.input').CreateAttendancePunchInput,
) {
  @Field(() => Int)
  id: number;
}
