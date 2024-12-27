import { InjectionToken, Provider } from '@angular/core';
import { SimpleComponentColor } from './../types/colors.types';

export interface ArdSpinnerDefaults {
  color: SimpleComponentColor;
}

const _spinnerDefaults: ArdSpinnerDefaults = {
  color: SimpleComponentColor.Primary,
};

export const ARD_SPINNER_DEFAULTS = new InjectionToken<ArdSpinnerDefaults>('ard-spinner-defaults', {
  factory: () => ({
    ..._spinnerDefaults
  }),
});

export function provideSpinnerDefaults(config: Partial<ArdSpinnerDefaults>): Provider {
  return { provide: ARD_SPINNER_DEFAULTS, useValue: { ..._spinnerDefaults, ...config } };
}