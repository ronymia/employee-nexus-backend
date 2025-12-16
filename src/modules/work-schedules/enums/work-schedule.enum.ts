import { registerEnumType } from '@nestjs/graphql';

export enum ScheduleType {
  REGULAR = 'REGULAR',
  SCHEDULED = 'SCHEDULED',
  FLEXIBLE = 'FLEXIBLE',
}

export enum ScheduleBreakType {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

registerEnumType(ScheduleType, {
  name: 'ScheduleType',
  description: 'Type of the work schedule',
});

registerEnumType(ScheduleBreakType, {
  name: 'ScheduleBreakType',
  description: 'Type of break in the schedule',
});
