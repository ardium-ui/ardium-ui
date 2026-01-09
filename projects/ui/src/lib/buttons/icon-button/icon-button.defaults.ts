import { InjectionToken, Provider } from '@angular/core';
import { _focusableComponentDefaults, _FocusableComponentDefaults } from '../../_internal/focusable-component';
import { _simpleButtonDefaults, _SimpleButtonDefaults } from '../_button-base.defaults';

export interface ArdIconButtonDefaults extends _SimpleButtonDefaults, _FocusableComponentDefaults {}

export const ARD_ICON_BUTTON_DEFAULTS = new InjectionToken<ArdIconButtonDefaults>('ard-icon-button-defaults', {
  factory: () => ({ ..._simpleButtonDefaults, ..._focusableComponentDefaults }),
});

export function provideIconButtonDefaults(config: Partial<ArdIconButtonDefaults>): Provider {
  return { provide: ARD_ICON_BUTTON_DEFAULTS, useValue: { ..._simpleButtonDefaults, ..._focusableComponentDefaults, ...config } };
}
