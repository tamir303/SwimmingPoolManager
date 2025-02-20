/**
 * DaysOfWeek Enum
 * Represents the days of the week.
 *
 * @enum {string}
 * @property {string} SUN - Sunday
 * @property {string} MON - Monday
 * @property {string} TUE - Tuesday
 * @property {string} WED - Wednesday
 * @property {string} THU - Thursday
 * @property {string} FRI - Friday
 * @property {string} SAT - Saturday
 */
export enum DaysOfWeek {
  SUN = "SUN",
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
}

export function getDayIndexInMonth(weekDayIndex: number): number {
  const today = new Date();
  // Find the Sunday of the current week.
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  
  // Add the given week day index.
  sunday.setDate(sunday.getDate() + weekDayIndex);
  
  // Convert to a 0-based day number (i.e. 1st becomes 0, 2nd becomes 1, etc.)
  return sunday.getDate() - 1;
}