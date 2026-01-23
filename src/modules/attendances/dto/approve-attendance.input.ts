import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class ApproveAttendanceInput {
  @Field(() => Int, { description: 'Attendance ID' })
  @IsInt()
  attendanceId: number;

  @Field(() => String, { nullable: true, description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
@InputType()
export class RejectAttendanceInput {
  @Field(() => Int, { description: 'Attendance ID' })
  @IsInt()
  attendanceId: number;

  @Field(() => String, { description: 'Remarks' })
  @IsString()
  remarks: string;
}
