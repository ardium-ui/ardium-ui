import { InjectionToken, Provider } from '@angular/core';
import { Grade, OpticalSize, Weight } from './icon.component';

export interface ArdIconDefaults {
  filled: boolean;
  weight: Weight;
  grade: Grade;
  opticalSize: OpticalSize;
  ariaLabel: string;
}

const _iconDefaults: ArdIconDefaults = {
  filled: false,
  weight: 400,
  grade: 0,
  opticalSize: 40,
  ariaLabel: '',
};

export const ARD_ICON_DEFAULTS = new InjectionToken<ArdIconDefaults>('ard-icon-defaults', {
  factory: () => ({
    ..._iconDefaults
  }),
});

export function provideIconDefaults(config: Partial<ArdIconDefaults>): Provider {
  return { provide: ARD_ICON_DEFAULTS, useValue: { ..._iconDefaults, ...config } };
}