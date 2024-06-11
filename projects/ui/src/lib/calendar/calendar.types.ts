export const CalendarRangeVariant = {
  Row: 'row',
  OutlineRounded: 'outline-rounded',
  OutlineSharp: 'outline-sharp',
} as const;
export type CalendarRangeVariant = (typeof CalendarRangeVariant)[keyof typeof CalendarRangeVariant];

export interface DateRange {
  low: Date;
  high: Date;
}

export interface YearRange {
  low: number;
  high: number;
}

export const CalendarView = {
  Years: 'years',
  Months: 'months',
  Days: 'days',
} as const;
export type CalendarView = (typeof CalendarView)[keyof typeof CalendarView];

//! template contexts
export interface CalendarYearsViewHeaderContext {
  nextPage: () => void;
  prevPage: () => void;
  openDaysView: () => void;
  yearRange: YearRange;
  dateRange: DateRange;
  $implicit: DateRange;
}

export interface CalendarMonthsViewHeaderContext {
  openDaysView: () => void;
  openYearsView: () => void;
  year: number;
  date: Date;
  $implicit: number;
}

export interface CalendarDaysViewHeaderContext {
  nextMonth: () => void;
  prevMonth: () => void;
  nextYear: () => void;
  prevYear: () => void;
  openYearsView: () => void;
  openMonthsView: () => void;
  year: number;
  month: number;
  date: Date;
  $implicit: Date;
}

export interface CalendarWeekdayContext {
  dayIndex: number;
  date: Date;
  $implicit: Date;
}

export interface CalendarFloatingMonthContext {
  month: number;
  date: Date;
  $implicit: Date;
}

export interface CalendarYearContext {
  value: number;
  date: Date;
  $implicit: number;
  select: (year: number) => void;
}

export interface CalendarMonthContext {
  month: number;
  date: Date;
  $implicit: Date;
  select: (month: number | Date) => void;
}

export interface CalendarDayContext {
  value: number;
  date: Date;
  $implicit: number;
  select: (day: number | Date) => void;
}

export interface CalendarActionButtonsContext {
  cancel: () => void;
  apply: () => void;
  reset: () => void;
}
