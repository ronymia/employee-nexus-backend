import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Convert minutes to readable hours and minutes format
 * @param minutes - Total minutes
 * @returns Formatted string like "2h 30min" or "45min"
 */
export function minutesToHoursAndMinutes(minutes: number): string {
  if (!minutes || minutes < 0) {
    return '0min';
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}min`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
}

/**
 * Convert minutes to decimal hours
 * @param minutes - Total minutes
 * @returns Decimal hours (e.g., 90 minutes = 1.5 hours)
 */
export function minutesToDecimalHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

/**
 * Calculate leave duration in minutes based on leave type and dates
 * @param leaveDuration - Type of leave (SINGLE_DAY, MULTI_DAY, HALF_DAY)
 * @param startDate - Start date of leave (UTC)
 * @param endDate - End date of leave (UTC, optional for single day)
 * @returns Total minutes for the leave
 */
export function calculateLeaveDurationInMinutes(
  leaveDuration: string,
  startDate: Date | string,
  endDate?: Date | string | null,
): number {
  const MINUTES_PER_DAY = 480; // 8 hours = 480 minutes
  const MINUTES_PER_HALF_DAY = 240; // 4 hours = 240 minutes

  switch (leaveDuration) {
    case 'HALF_DAY':
      return MINUTES_PER_HALF_DAY;

    case 'SINGLE_DAY':
      return MINUTES_PER_DAY;

    case 'MULTI_DAY': {
      if (!endDate) {
        return MINUTES_PER_DAY; // Default to single day if no end date
      }

      const start = dayjs.utc(startDate);
      const end = dayjs.utc(endDate);

      // Calculate difference in days (including both start and end dates)
      const diffDays = end.diff(start, 'day') + 1;

      return diffDays * MINUTES_PER_DAY;
    }

    default:
      return MINUTES_PER_DAY;
  }
}
