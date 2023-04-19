export function toCalendarArray(date: Date, firstWeekday: number = 1): CalendarArray {
    firstWeekday %= 7;

    const firstDayDate = new Date(date);
    firstDayDate.setDate(1);
    const firstDayWeekday = (firstDayDate.getDay() - firstWeekday + 7) % 7;

    const lastDayDate = new Date(firstDayDate);
    lastDayDate.setMonth(firstDayDate.getMonth() + 1);
    lastDayDate.setDate(0);
    const lastDay = lastDayDate.getDate();

    const calendarArray: (number | null)[][] = [];
    let currentDay = -firstDayWeekday;
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