import { InjectionToken, Provider } from '@angular/core';
import { SimpleComponentColor } from '../types/colors.types';

export interface ArdCalendarDefaults {
  color: SimpleComponentColor;
}

const _calendarDefaults: ArdCalendarDefaults = {
  color: SimpleComponentColor.Primary,
};

export const ARD_CALENDAR_DEFAULTS = new InjectionToken<ArdCalendarDefaults>('ard-calendar-defaults', {
  factory: () => ({
    ..._calendarDefaults,
  }),
});

export function provideCalendarDefaults(config: Partial<ArdCalendarDefaults>): Provider {
  return { provide: ARD_CALENDAR_DEFAULTS, useValue: { ..._calendarDefaults, ...config } };
}
