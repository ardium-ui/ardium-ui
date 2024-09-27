import { InjectionToken } from '@angular/core';
import { CompareWithFn, Nullable } from '@ardium-ui/ui';
import { _ngModelComponentDefaults, _NgModelComponentDefaults } from '../_internal/ngmodel-component';
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

export const ARD_CHECKBOX_LIST_DEFAULTS = new InjectionToken<ArdCheckboxListDefaults>('ard-checkbox-list-defaults', {
  factory: () => ({
    ..._ngModelComponentDefaults,
    valueFrom: 'value',
    labelFrom: 'label',
    disabledFrom: 'disabled',
    compareWith: null,
    invertDisabled: false,
    maxSelectedItems: Infinity,
    color: ComponentColor.Primary,
    align: CheckboxListAlignType.LeftClumped,
    compact: false,
  }),
});
