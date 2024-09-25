import { InjectionToken } from '@angular/core';
import { _buttonBaseDefaults, _ButtonBaseDefaults } from '../_button-base.defaults';
import { ButtonVariant } from '../general-button.types';
import { SimpleOneAxisAlignment } from './../../types/alignment.types';

export interface ArdButtonDefaults extends _ButtonBaseDefaults {
  variant: ButtonVariant;
  alignIcon: SimpleOneAxisAlignment;
  vertical: boolean;
}

export const ARD_BUTTON_DEFAULTS = new InjectionToken<ArdButtonDefaults>('ard-button-defaults', {
  factory: () => ({
    ..._buttonBaseDefaults,
    variant: ButtonVariant.Rounded,
    alignIcon: SimpleOneAxisAlignment.Left,
    vertical: false,
  }),
});
