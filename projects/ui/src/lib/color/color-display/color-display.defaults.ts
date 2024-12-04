import { InjectionToken, Provider } from '@angular/core';
import { ColorDisplayAppearance } from './color-display.types';

export interface ArdColorDisplayDefaults {
  ariaLabel: string;
  withLabel: boolean;
  appearance: ColorDisplayAppearance;
}

const _colorDisplayDefaults: ArdColorDisplayDefaults = {
  ariaLabel: '',
  withLabel: false,
  appearance: ColorDisplayAppearance.Rounded,
};

export const ARD_COLOR_DISPLAY_DEFAULTS = new InjectionToken<ArdColorDisplayDefaults>('ard-color-display-defaults', {
  factory: () => ({
    ..._colorDisplayDefaults,
  }),
});

export function provideColorDisplayDefaults(config: Partial<ArdColorDisplayDefaults>): Provider {
  return { provide: ARD_COLOR_DISPLAY_DEFAULTS, useValue: { ..._colorDisplayDefaults, ...config } };
}
