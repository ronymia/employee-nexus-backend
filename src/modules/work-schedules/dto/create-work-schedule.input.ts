import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleBreakType, ScheduleType, Status } from 'generated/prisma';
import { CreateDayScheduleInput } from './create-day-schedule.input';

@InputType()
export class CreateWorkScheduleInput {
  @Field(() => String, {
    description: 'Name of the work schedule',
  })
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'Description of the work schedule',
  })
  @IsString()
  description: string;

  @Field(() => Status, {
    description: 'Status of the work schedule',
    defaultValue: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @Field(() => ScheduleType, {
    description: 'Type of the schedule',
    defaultValue: ScheduleType.REGULAR,
  })
  @IsOptional()
  @IsEnum(ScheduleType)
  scheduleType?: ScheduleType;

  @Field(() => ScheduleBreakType, {
    description: 'Type of break in the schedule',
    defaultValue: ScheduleBreakType.UNPAID,
  })
  @IsOptional()
  @IsEnum(ScheduleBreakType)
  breakType?: ScheduleBreakType;

  @Field(() => Int, {
    description: 'Number of break hours',
    defaultValue: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  breakHours?: number;

  @Field(() => [CreateDayScheduleInput], {
    description:
      'Day schedules for this work schedule. Required for SCHEDULED and FLEXIBLE types. For REGULAR type, provide 7 schedules (one per day) with same time slots.',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one day schedule is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateDayScheduleInput)
  schedules: CreateDayScheduleInput[];
}
