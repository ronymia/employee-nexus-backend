import {
  CreateAttendanceInput,
  CreateAttendancePunchInput,
} from './create-attendance.input';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateAttendanceInput extends CreateAttendanceInput {
  @Field(() => ID, { description: 'Attendance ID' })
  id: number;
}

// @InputType()
// export class UpdateAttendancePunchInput extends CreateAttendancePunchInput {
//   @Field(() => ID, { description: 'Attendance Punch ID' })
//   id: number;
// }
