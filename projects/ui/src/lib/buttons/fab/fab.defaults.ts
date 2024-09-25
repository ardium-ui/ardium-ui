import { InjectionToken } from '@angular/core';
import { _buttonBaseDefaults, _ButtonBaseDefaults } from '../_button-base.defaults';
import { FABSize } from '../general-button.types';

export interface ArdFabDefaults extends _ButtonBaseDefaults {
  size: FABSize;
  extended: boolean;
}

export const ARD_FAB_DEFAULTS = new InjectionToken<ArdFabDefaults>('ard-fab-defaults', {
  factory: () => ({
    ..._buttonBaseDefaults,
    size: FABSize.Standard,
    extended: false,
  }),
});
