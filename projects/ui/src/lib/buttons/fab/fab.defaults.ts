import { InjectionToken, Provider } from '@angular/core';
import { _buttonBaseDefaults, _ButtonBaseDefaults } from '../_button-base.defaults';
import { FABSize } from '../general-button.types';

export interface ArdFabDefaults extends _ButtonBaseDefaults {
  size: FABSize;
  extended: boolean;
}

const _fabDefaults = {
    ..._buttonBaseDefaults,
    size: FABSize.Standard,
    extended: false,
};

export const ARD_FAB_DEFAULTS = new InjectionToken<ArdFabDefaults>('ard-fab-defaults', {
  factory: () => ({
    ..._fabDefaults,
  }),
});

export function provideFabDefaults(config: Partial<ArdFabDefaults>): Provider {
  return { provide: ARD_FAB_DEFAULTS, useValue: { ..._fabDefaults, ...config } };
}