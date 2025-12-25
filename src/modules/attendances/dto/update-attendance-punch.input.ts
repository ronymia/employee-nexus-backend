import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateAttendancePunchInput } from './create-attendance-punch.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateAttendancePunchInput extends CreateAttendancePunchInput {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  id: number;

  @Field(() => Int, {
    description: 'Attendance ID (optional for nested creation)',
  })
  @IsInt()
  attendanceId: number;
}
