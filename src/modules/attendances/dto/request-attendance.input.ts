import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendancePunchInput } from './create-attendance.input';

@InputType()
export class RequestAttendanceInput {
  @Field(() => Date, { description: 'Date of attendance' })
  @IsDateString()
  date: Date;

  @Field(() => Int, {
    nullable: true,
    description: 'Total break minutes for the day',
  })
  @IsOptional()
  @IsNumber()
  breakMinutes?: number;

  @Field(() => [CreateAttendancePunchInput], {
    description: 'Punch records for this attendance',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendancePunchInput)
  punchRecords: CreateAttendancePunchInput[];
}
