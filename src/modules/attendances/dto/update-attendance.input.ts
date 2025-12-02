import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { CreateAttendanceInput } from './create-attendance.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { CreateAttendancePunchInput } from './create-attendance-punch.input';

@InputType()
export class UpdateAttendanceInput extends PartialType(CreateAttendanceInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => [CreateAttendancePunchInput], {
    nullable: true,
    description: 'Punch records for this attendance',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendancePunchInput)
  punchRecords: CreateAttendancePunchInput[];
}
