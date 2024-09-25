import { InjectionToken } from '@angular/core';
import { _simpleButtonDefaults, _SimpleButtonDefaults } from '../_button-base.defaults';

export interface ArdIconButtonDefaults extends _SimpleButtonDefaults {}

export const ARD_ICON_BUTTON_DEFAULTS = new InjectionToken<ArdIconButtonDefaults>('ard-icon-button-defaults', {
  factory: () => _simpleButtonDefaults,
});
