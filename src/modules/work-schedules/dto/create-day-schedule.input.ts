import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsInt,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTimeSlotInput } from './create-time-slot.input';

@InputType()
export class CreateDayScheduleInput {
  @Field(() => Int, {
    description: 'Day of the week (0-6, where 0 is Sunday)',
  })
  @IsInt()
  @Min(0)
  @Max(6)
  day: number;

  @Field(() => Boolean, {
    description: 'Whether this day is a weekend',
  })
  @IsBoolean()
  isWeekend: boolean;

  @Field(() => [CreateTimeSlotInput], {
    description:
      'Time slots for this day. REGULAR: single slot (same for all days), SCHEDULED: single slot (different per day), FLEXIBLE: multiple slots per day',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one time slot is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateTimeSlotInput)
  timeSlots: CreateTimeSlotInput[];
}
