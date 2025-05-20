import { isDefined } from "simple-bool";

export function isMonthOutOfRange(month: number, year: number, min: Date | null, max: Date | null): number {
  const dateForMinComparison = new Date(year, month + 1, 0); // last day of month
  if (isDefined(min) && dateForMinComparison < min) return -1;

  const dateForMaxComparison = new Date(year, month, 1); // first day of month
  if (isDefined(max) && dateForMaxComparison > max) return 1;

  return 0;
}