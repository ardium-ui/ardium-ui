import { InjectionToken, Provider } from '@angular/core';
import { _buttonBaseDefaults, _ButtonBaseDefaults } from '../_button-base.defaults';
import { ButtonVariant } from '../general-button.types';
import { SimpleOneAxisAlignment } from './../../types/alignment.types';

export interface ArdButtonDefaults extends _ButtonBaseDefaults {
  variant: ButtonVariant;
  alignIcon: SimpleOneAxisAlignment;
  vertical: boolean;
}

const _buttonDefaults: ArdButtonDefaults = {
  ..._buttonBaseDefaults,
  variant: ButtonVariant.Rounded,
  alignIcon: SimpleOneAxisAlignment.Left,
  vertical: false,
};

export const ARD_BUTTON_DEFAULTS = new InjectionToken<ArdButtonDefaults>('ard-button-defaults', {
  factory: () => ({ ..._buttonDefaults }),
});

export function provideButtonDefaults(config: Partial<ArdButtonDefaults>): Provider {
  return { provide: ARD_BUTTON_DEFAULTS, useValue: { ..._buttonDefaults, ...config } };
}
