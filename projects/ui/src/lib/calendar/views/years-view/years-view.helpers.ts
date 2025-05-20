import { isDefined } from "simple-bool";

export function getCalendarYearsArray(startYear: number, yearCount: number): number[] {
  return new Array(yearCount).fill(startYear).map((v, i) => v + i);
}
export function isYearOutOfRange(year: number, min: Date | null, max: Date | null): number {
  const dateForMinComparison = new Date(year, 0, 1);
  if (isDefined(min) && dateForMinComparison < min) return -1;

  const dateForMaxComparison = new Date(year, 11, 31);
  if (isDefined(max) && dateForMaxComparison > max) return 1;

  return 0;
}