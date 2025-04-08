import { InjectionToken, Provider } from '@angular/core';
import { _FocusableComponentDefaults, _focusableComponentDefaults } from '../../_internal/focusable-component';
import { SimpleComponentColor } from './../../types/colors.types';

export interface ArdRadioDefaults extends _FocusableComponentDefaults {
  color: SimpleComponentColor;
}

const _radioDefaults: ArdRadioDefaults = {
  ..._focusableComponentDefaults,
  color: SimpleComponentColor.Primary,
};

export const ARD_RADIO_DEFAULTS = new InjectionToken<ArdRadioDefaults>('ard-radio-defaults', {
  factory: () => ({
    ..._radioDefaults,
  }),
});

export function provideRadioDefaults(config: Partial<ArdRadioDefaults>): Provider {
  return { provide: ARD_RADIO_DEFAULTS, useValue: { ..._radioDefaults, ...config } };
}
