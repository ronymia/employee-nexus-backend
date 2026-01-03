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
