import { InjectionToken, Provider } from '@angular/core';
import { _booleanComponentDefaults, _BooleanComponentDefaults } from '../../_internal/boolean-component';
import { SimpleComponentColor } from './../../types/colors.types';

export interface ArdRadioDefaults extends _BooleanComponentDefaults {
  color: SimpleComponentColor;
}

const _radioDefaults: ArdRadioDefaults = {
  ..._booleanComponentDefaults,
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
