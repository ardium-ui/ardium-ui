import { InjectionToken } from '@angular/core';

export interface ArdDividerDefaults {
  vertical: boolean;
}

export const ARD_DIVIDER_DEFAULTS = new InjectionToken<ArdDividerDefaults>('ard-divider-defaults', {
  factory: () => ({
    vertical: false,
  }),
});
