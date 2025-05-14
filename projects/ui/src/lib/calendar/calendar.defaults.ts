import { InjectionToken, Provider } from '@angular/core';
import { _ngModelComponentDefaults, _NgModelComponentDefaults } from '../_internal/ngmodel-component';
import { ComponentColor } from '../types/colors.types';
import { ArdCalendarView } from './calendar.types';

export interface ArdCalendarDefaults extends _NgModelComponentDefaults {
  color: ComponentColor;
  activeView: ArdCalendarView;
  activeYear: number;
  activeMonth: number;
  firstWeekday: number;
  multipleYearPageChangeModifier: number;
}

const _calendarDefaults: ArdCalendarDefaults = {
  ..._ngModelComponentDefaults,
  color: ComponentColor.Primary,
  activeView: ArdCalendarView.Days,
  activeYear: new Date().getFullYear(),
  activeMonth: new Date().getMonth(),
  firstWeekday: 1,
  multipleYearPageChangeModifier: 5,
};

export const ARD_CALENDAR_DEFAULTS = new InjectionToken<ArdCalendarDefaults>('ard-calendar-defaults', {
  factory: () => ({
    ..._calendarDefaults,
  }),
});

export function provideCalendarDefaults(config: Partial<ArdCalendarDefaults>): Provider {
  return { provide: ARD_CALENDAR_DEFAULTS, useValue: { ..._calendarDefaults, ...config } };
}
