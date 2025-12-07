import { InjectionToken, Provider } from '@angular/core';
import { _ngModelComponentDefaults, _NgModelComponentDefaults } from '../_internal/ngmodel-component';
import { CompareWithFn } from '../types/item-storage.types';
import { Nullable } from '../types/utility.types';
import { ComponentColor } from './../types/colors.types';
import { CheckboxListAlignType } from './checkbox-list.types';

export interface ArdCheckboxListDefaults extends _NgModelComponentDefaults {
  valueFrom: string;
  labelFrom: string;
  disabledFrom: string;
  compareWith: Nullable<CompareWithFn>;
  invertDisabled: boolean;
  maxSelectedItems: number;
  color: ComponentColor;
  align: CheckboxListAlignType;
  compact: boolean;
}

const _checkboxListDefaults: ArdCheckboxListDefaults = {
  ..._ngModelComponentDefaults,
  valueFrom: 'value',
  labelFrom: 'label',
  disabledFrom: 'disabled',
  compareWith: undefined,
  invertDisabled: false,
  maxSelectedItems: Infinity,
  color: ComponentColor.Primary,
  align: CheckboxListAlignType.LeftClumped,
  compact: false,
};

export const ARD_CHECKBOX_LIST_DEFAULTS = new InjectionToken<ArdCheckboxListDefaults>('ard-checkbox-list-defaults', {
  factory: () => ({
    ..._checkboxListDefaults,
  }),
});

export function provideCheckboxListDefaults(config: Partial<ArdCheckboxListDefaults>): Provider {
  return { provide: ARD_CHECKBOX_LIST_DEFAULTS, useValue: { ..._checkboxListDefaults, ...config } };
}
