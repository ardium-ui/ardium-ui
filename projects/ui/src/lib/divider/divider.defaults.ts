import { InjectionToken, Provider } from '@angular/core';

export interface ArdDividerDefaults {
  vertical: boolean;
}

const _dividerDefaults: ArdDividerDefaults = {
  vertical: false,
};

export const ARD_DIVIDER_DEFAULTS = new InjectionToken<ArdDividerDefaults>('ard-divider-defaults', {
  factory: () => ({
    ..._dividerDefaults,
  }),
});

export function provideDividerDefaults(config: Partial<ArdDividerDefaults>): Provider {
  return { provide: ARD_DIVIDER_DEFAULTS, useValue: { ..._dividerDefaults, ...config } };
}
