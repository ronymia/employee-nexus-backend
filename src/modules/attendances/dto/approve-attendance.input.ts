import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class ApproveAttendanceInput {
  @Field(() => Int, { description: 'Attendance ID' })
  @IsInt()
  id: number;

  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;
}
