

export type CalendarArray = {
    array: (number | null)[][];
    leadingSpaces: number;
    trailingSpaces: number;
    weeks: number;
}

/**
 * Generates a layout array to be used to create a calendar page for the given date's month.
 * 
 * The returned object contains an array to create the layout from, the number of leading and trailing spaces in the layout, and the number of weeks (full or not) in the month.
 * @param date The date to get the month from.
 * @param firstWeekday The index of the first weekday in the calendar layout. Starts at Sunday, with the index 0. Defaults to 1.
 * @returns A {@link CalendarArray} object.
 */
export function getMonthLayout(date: Date, firstWeekday: number = 1): CalendarArray {
    firstWeekday %= 7;

    const firstDayDate = new Date(date);
    firstDayDate.setDate(1);
    const firstDayWeekday = (firstDayDate.getDay() - firstWeekday + 7) % 7;

    const lastDayDate = new Date(firstDayDate);
    lastDayDate.setMonth(firstDayDate.getMonth() + 1);
    lastDayDate.setDate(0);
    const lastDay = lastDayDate.getDate();

    const calendarArray: (number | null)[][] = [];
    let currentDay = firstDayWeekday * -1;
    let trailingSpaces = 0;
    let totalWeeks = NaN;

    for (let week = 0; week < 6; week++) {
        const currentWeek: (number | null)[] = [];
        for (let weekday = 0; weekday < 7; weekday++) {
            currentDay++;
            if (currentDay < 1 || currentDay > lastDay) {
                currentWeek.push(null);
                trailingSpaces++;
                continue;
            }
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