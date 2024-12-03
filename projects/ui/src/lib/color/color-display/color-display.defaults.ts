import { InjectionToken } from '@angular/core';
import { ColorDisplayAppearance } from 'dist/ui';

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
