export const ArdCalendarView = {
  Days: 'days',
  Months: 'months',
  Years: 'years',
} as const;
export type ArdCalendarView = (typeof ArdCalendarView)[keyof typeof ArdCalendarView];

export interface DateRange {
  low: Date;
  high: Date;
}

export interface YearRange {
  low: number;
  high: number;
}

export type ArdCalendarFilterFn = (date: Date) => boolean;

//! template contexts
export interface CalendarYearsViewHeaderContext {
  nextPage: () => void;
  prevPage: () => void;
  openMonthsView: () => void;
  openDaysView: () => void;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
  yearRange: YearRange;
  dateRange: DateRange;
  $implicit: DateRange;
}

export interface CalendarMonthsViewHeaderContext {
  nextPage: () => void;
  prevPage: () => void;
  openDaysView: () => void;
  openYearsView: () => void;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
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
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
  year: number;
  month: number;
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
  $implicit: Date;
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
