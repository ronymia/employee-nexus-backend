// DAY SCHEDULE ENTITY - DEFINES GRAPHQL TYPES FOR DAY SCHEDULE MANAGEMENT
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WorkSchedule } from './work-schedule.entity';
import { TimeSlot } from './time-slot.entity';

@ObjectType()
export class DaySchedule {
  @Field(() => ID, {
    description: 'Unique identifier for the day schedule',
  })
  id: number;

  @Field(() => Int, {
    description: 'Day of the week (0-6, where 0=Sunday)',
  })
  day: number;

  @Field(() => Boolean, {
    description: 'Whether this day is a weekend',
  })
  isWeekend: boolean;

  @Field(() => Int, {
    description: 'ID of the work schedule',
  })
  workScheduleId: number;

  @Field(() => WorkSchedule, {
    description: 'Work schedule this day belongs to',
  })
  workSchedule: WorkSchedule;

  @Field(() => [TimeSlot], {
    description: 'Time slots for this day',
  })
  timeSlots: TimeSlot[];
}
