import { DaysOfWeek } from "../utils/days-week-enum.utils";

export const sortDays = (days: DaysOfWeek[]): DaysOfWeek[] =>
  days.sort(
    (a, b) =>
      Object.values(DaysOfWeek).indexOf(a) - Object.values(DaysOfWeek).indexOf(b)
);
