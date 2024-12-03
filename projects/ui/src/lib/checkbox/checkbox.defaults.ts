import { InjectionToken, Provider } from '@angular/core';
import { _booleanComponentDefaults, _BooleanComponentDefaults } from '../_internal/boolean-component';
import { SimpleComponentColor } from './../types/colors.types';

export interface ArdCheckboxDefaults extends _BooleanComponentDefaults {
  color: SimpleComponentColor;
  unselectedColor: SimpleComponentColor;
}

const _checkboxDefaults = {
    ..._booleanComponentDefaults,
    color: SimpleComponentColor.Primary,
    unselectedColor: SimpleComponentColor.None,
};

export const ARD_CHECKBOX_DEFAULTS = new InjectionToken<ArdCheckboxDefaults>('ard-checkbox-defaults', {
  factory: () => ({
    ..._checkboxDefaults,
  }),
});

export function provideCheckboxDefaults(config: Partial<ArdCheckboxDefaults>): Provider {
  return { provide: ARD_CHECKBOX_DEFAULTS, useValue: { ..._checkboxDefaults, ...config } };
}
