export function getCalendarYearsArray(startYear: number, yearCount: number): number[] {
  return new Array(yearCount).fill(startYear).map((v, i) => v + i);
}
