import { InjectionToken } from '@angular/core';
import { _booleanComponentDefaults, _BooleanComponentDefaults } from '../_internal/boolean-component';
import { SimpleComponentColor } from './../types/colors.types';

export interface ArdCheckboxDefaults extends _BooleanComponentDefaults {
  color: SimpleComponentColor;
  unselectedColor: SimpleComponentColor;
}

export const ARD_CHECKBOX_DEFAULTS = new InjectionToken<ArdCheckboxDefaults>('ard-checkbox-defaults', {
  factory: () => ({
    ..._booleanComponentDefaults,
    color: SimpleComponentColor.Primary,
    unselectedColor: SimpleComponentColor.None,
  }),
});
