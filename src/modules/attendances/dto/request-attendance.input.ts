import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendancePunchInput } from './create-attendance-punch.input';

@InputType()
export class RequestAttendanceInput {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Date, { description: 'Date of attendance' })
  @IsDateString()
  date: Date;

  @Field(() => Float, {
    nullable: true,
    description: 'Total working hours for the day',
  })
  @IsOptional()
  @IsNumber()
  totalHours?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Total break hours for the day',
  })
  @IsOptional()
  @IsNumber()
  breakHours?: number;

  @Field(() => String, {
    description: 'Attendance status',
    defaultValue: 'pending_approve',
  })
  @IsString()
  status: string;

  @Field(() => [CreateAttendancePunchInput], {
    nullable: true,
    description: 'Punch records for this attendance',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendancePunchInput)
  punchRecords: CreateAttendancePunchInput[];
}
