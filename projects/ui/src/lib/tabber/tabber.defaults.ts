import { InjectionToken, Provider } from '@angular/core';
import { OneAxisAlignment } from './../types/alignment.types';
import { ComponentColor } from './../types/colors.types';

export interface ArdTabberDefaults {
  tabDisabled: boolean;
  tabPointerEventsWhenDisabled: boolean;
  color: ComponentColor;
  stretchTabs: boolean;
  uniformTabWidths: boolean;
  tabAlignment: OneAxisAlignment;
  tabIndex: number;
}

const _tabberDefaults: ArdTabberDefaults = {
  tabDisabled: false,
  tabPointerEventsWhenDisabled: false,
  color: ComponentColor.Primary,
  stretchTabs: false,
  uniformTabWidths: false,
  tabAlignment: OneAxisAlignment.Left,
  tabIndex: 0,
};

export const ARD_TABBER_DEFAULTS = new InjectionToken<ArdTabberDefaults>('ard-tabber-defaults', {
  factory: () => ({
    ..._tabberDefaults,
  }),
});

export function provideTabberDefaults(config: Partial<ArdTabberDefaults>): Provider {
  return { provide: ARD_TABBER_DEFAULTS, useValue: { ..._tabberDefaults, ...config } };
}
