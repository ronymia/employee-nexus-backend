import {
  ScheduleBreakType,
  ScheduleType,
} from 'src/modules/work-schedules/enums';

export const defaultWorkSchedule = {
  name: 'Regular Shift',
  description: 'Standard 5-day work week schedule',
  status: 'ACTIVE',
  scheduleType: ScheduleType.REGULAR,
  breakType: ScheduleBreakType.PAID,
  breakMinutes: 60, // 1 hour break
  schedules: [
    {
      dayOfWeek: 0, // Sunday
      isWeekend: true,
      timeSlots: [
        {
          startTime: '10:00:00',
          endTime: '18:00:00',
        },
      ], // No work on weekends
    },
    {
      dayOfWeek: 1, // Monday
      isWeekend: false,
      timeSlots: [
        {
          startTime: '10:00:00',
          endTime: '18:00:00',
        },
      ],
    },
    {
      dayOfWeek: 2, // Tuesday
      isWeekend: false,
      timeSlots: [
        {
          startTime: '10:00:00',
          endTime: '18:00:00',
        },
      ],
    },
    {
      dayOfWeek: 3, // Wednesday
      isWeekend: false,
      timeSlots: [
        {
          startTime: '10:00:00',
          endTime: '18:00:00',
        },
      ],
    },
    {
      dayOfWeek: 4, // Thursday
      isWeekend: false,
      timeSlots: [
        {
          startTime: '10:00:00',
          endTime: '18:00:00',
        },
      ],
    },
    {
      dayOfWeek: 5, // Friday
      isWeekend: false,
      timeSlots: [
        {
          startTime: '10:00:00',
          endTime: '18:00:00',
        },
      ],
    },
    {
      dayOfWeek: 6, // Saturday
      isWeekend: true,
      timeSlots: [
        {
          startTime: '10:00:00',
          endTime: '18:00:00',
        },
      ], // No work on weekends
    },
  ],
};
