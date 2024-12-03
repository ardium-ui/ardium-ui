import { InjectionToken } from '@angular/core';
import { ColorDisplayAppearance } from './color-display.types';

export interface ArdColorDisplayDefaults {
  ariaLabel: string;
  withLabel: boolean;
  appearance: ColorDisplayAppearance;
}

export const ARD_COLOR_DISPLAY_DEFAULTS = new InjectionToken<ArdColorDisplayDefaults>('ard-color-display-defaults', {
  factory: () => ({
    ariaLabel: '',
    withLabel: false,
    appearance: ColorDisplayAppearance.Rounded,
  }),
});
