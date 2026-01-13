import { isDefined } from 'simple-bool';

export function getUTCDate(): Date;
export function getUTCDate(year: number, monthIndex: number, day: number): Date;
export function getUTCDate(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number
): Date;
export function getUTCDate(
  year?: number,
  monthIndex?: number,
  day?: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
  millisecond: number = 0
): Date {
  if (!isDefined(year) && !isDefined(monthIndex) && !isDefined(day)) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + now.getTimezoneOffset());
    return now;
  }
  return new Date(Date.UTC(year!, monthIndex, day, hour, minute, second, millisecond));
}


export function createDate(year: number, month: number, date: number, UTC: boolean) {
  if (UTC) {
    return getUTCDate(year, month, date);
  } else {
    return new Date(year, month, date);
  }
}

export function getDateComponents(date: null, UTC: boolean): { year: null; month: null; date: null };
export function getDateComponents(date: Date, UTC: boolean): { year: number; month: number; date: number };
export function getDateComponents(date: Date | null, UTC: boolean): { year: number | null; month: number | null; date: number | null };
export function getDateComponents(date: Date | null, UTC: boolean): { year: number | null; month: number | null; date: number | null } {
  if (!date) {
    return { year: null, month: null, date: null };
  }
  return {
    year: UTC ? date.getUTCFullYear() : date.getFullYear(),
    month: UTC ? date.getUTCMonth() : date.getMonth(),
    date: UTC ? date.getUTCDate() : date.getDate(),
  };
}