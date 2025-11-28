// TIME SLOT ENTITY - DEFINES GRAPHQL TYPES FOR TIME SLOT MANAGEMENT
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { DaySchedule } from './day-schedule.entity';

@ObjectType()
export class TimeSlot {
  @Field(() => String, {
    description: 'Start time of the slot',
  })
  startTime: string;

  @Field(() => String, {
    description: 'End time of the slot',
  })
  endTime: string;

  @Field(() => Int, {
    description: 'ID of the day schedule',
  })
  scheduleId: number;

  @Field(() => DaySchedule, {
    description: 'Day schedule this time slot belongs to',
  })
  schedule: DaySchedule;
}
