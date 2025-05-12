export type CalendarArray = (number | null)[][];

export interface CalendarData {
  array: CalendarArray;
  leadingSpaces: number;
  trailingSpaces: number;
  weeks: number;
}

/**
 * Generates a layout array to be used to create a calendar page for the given year and month.
 *
 * The returned object contains an array to create the layout from, the number of leading and trailing spaces in the layout, and the number of weeks (full or not) in the month.
 * @param year The year of the current active view
 * @param monthIndex The month index of the current active view
 * @param firstWeekday The index of the first weekday in the calendar layout. Starts at Sunday (index 0), ends with Saturday (index 6). Defaults to 1.
 * @returns A {@link CalendarData} object.
 */
export function getCalendarData(year: number, monthIndex: number, firstWeekday = 1): CalendarData {
  firstWeekday %= 7;

  const firstDayDate = new Date(year, monthIndex, 1);
  const firstDayWeekday = (firstDayDate.getDay() - firstWeekday + 7) % 7;

  const lastDayDate = new Date(firstDayDate);
  lastDayDate.setMonth(firstDayDate.getMonth() + 1); // advance the month by 1
  lastDayDate.setDate(0); // set the date to 0, which essentially means "the last day of the previous month"
  const lastDay = lastDayDate.getDate();

  const calendarArray: CalendarArray = [];
  let currentDay = firstDayWeekday * -1; // how many empty spaces to add
  let trailingSpaces = 0;
  let totalWeeks = NaN;

  for (let week = 0; week < 6; week++) {
    const currentWeek: (number | null)[] = [];
    // add days for the whole week
    for (let weekday = 0; weekday < 7; weekday++) {
      currentDay++;
      // add empty space before the first day of the month
      if (currentDay < 1 || currentDay > lastDay) {
        currentWeek.push(null);
        trailingSpaces++;
        continue;
      }
      // add the day number
      currentWeek.push(currentDay);
    }
    calendarArray.push(currentWeek);
    if (currentDay > lastDay) {
      totalWeeks = week + 1;
      break;
    }
  }
  trailingSpaces -= firstDayWeekday;

  return {
    array: calendarArray,
    leadingSpaces: firstDayWeekday,
    trailingSpaces,
    weeks: totalWeeks,
  };
}

export function getCalendarWeekdayArray(firstWeekday = 1): number[] {
  return [0, 1, 2, 3, 4, 5, 6].map(v => (v + firstWeekday) % 7);
}
