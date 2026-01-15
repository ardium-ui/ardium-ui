import { InjectionToken, Provider } from '@angular/core';
import { _FormFieldComponentDefaults, _formFieldComponentDefaults } from '../_internal/form-field-component';
import { ComponentColor } from '../types/colors.types';
import { ArdCalendarFilterFn, ArdCalendarView, ArdMultiCalendarLocation } from './calendar.types';

export interface ArdCalendarDefaults extends _FormFieldComponentDefaults {
  color: ComponentColor;
  activeView: ArdCalendarView;
  activeYear: number;
  activeMonth: number;
  firstWeekday: number;
  multipleYearPageChangeModifier: number;
  autoFocus: boolean;
  multiCalendarLocation: ArdMultiCalendarLocation;
  min: Date | null;
  max: Date | null;
  filter: ArdCalendarFilterFn | null;
  UTC: boolean;
  // template customizations
  daysViewHeaderDateFormat: string;
  yearsViewHeaderDateFormat: string;
  monthsViewHeaderDateFormat: string;
  weekdayDateFormat: string;
  weekdayTitleDateFormat: string;
  floatingMonthDateFormat: string;
  floatingMonthTitleDateFormat: string;
  yearDateFormat: string;
  monthDateFormat: string;
  dayDateFormat: string;
}

const _calendarDefaults: ArdCalendarDefaults = {
  ..._formFieldComponentDefaults,
  color: ComponentColor.Primary,
  activeView: ArdCalendarView.Days,
  activeYear: new Date().getFullYear(),
  activeMonth: new Date().getMonth(),
  firstWeekday: 1,
  multipleYearPageChangeModifier: 5,
  autoFocus: false,
  multiCalendarLocation: ArdMultiCalendarLocation.Only,
  min: null,
  max: null,
  filter: null,
  UTC: false,
  // template customizations
  daysViewHeaderDateFormat: 'MMM yyyy',
  yearsViewHeaderDateFormat: 'yyyy',
  monthsViewHeaderDateFormat: 'yyyy',
  weekdayDateFormat: 'EEEEE',
  weekdayTitleDateFormat: 'EEEE',
  floatingMonthDateFormat: 'LLL',
  floatingMonthTitleDateFormat: 'LLLL',
  yearDateFormat: 'yyyy',
  monthDateFormat: 'MMM',
  dayDateFormat: 'd',
};

export const ARD_CALENDAR_DEFAULTS = new InjectionToken<ArdCalendarDefaults>('ard-calendar-defaults', {
  factory: () => ({
    ..._calendarDefaults,
  }),
});

export function provideCalendarDefaults(config: Partial<ArdCalendarDefaults>): Provider {
  return { provide: ARD_CALENDAR_DEFAULTS, useValue: { ..._calendarDefaults, ...config } };
}
