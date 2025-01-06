import { InjectionToken, Provider } from '@angular/core';

export interface ArdTabDefaults {
  disabled: boolean;
}

const _tabDefaults: ArdTabDefaults = {
  disabled: false,
};

export const ARD_TAB_DEFAULTS = new InjectionToken<ArdTabDefaults>('ard-tab-defaults', {
  factory: () => ({
    ..._tabDefaults,
  }),
});

export function provideTabDefaults(config: Partial<ArdTabDefaults>): Provider {
  return { provide: ARD_TAB_DEFAULTS, useValue: { ..._tabDefaults, ...config } };
}
