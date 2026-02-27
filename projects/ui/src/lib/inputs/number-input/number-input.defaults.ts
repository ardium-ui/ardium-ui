import { InjectionToken, Provider } from '@angular/core';
import { _FormFieldComponentDefaults, _formFieldComponentDefaults } from '../../_internal/form-field-component';
import { OneAxisAlignment } from './../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';

export interface ArdNumberInputDefaults extends _FormFieldComponentDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  compact: boolean;
  placeholder: string;
  alignText: OneAxisAlignment;
  inputAttrs: Record<string, any>;
  min: number;
  max: number;
  maxDecimalPlaces: number;
  fixedDecimalPlaces: boolean;
  decimalSeparator: string;
  allowFloat: boolean;
  noButtons: boolean;
  stepSize: number;
  keepFocusOnQuickChangeButton: boolean;
}

const _numberInputDefaults: ArdNumberInputDefaults = {
  ..._formFieldComponentDefaults,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  compact: false,
  placeholder: '',
  alignText: OneAxisAlignment.Middle,
  inputAttrs: {},
  min: 0,
  max: Infinity,
  maxDecimalPlaces: Infinity,
  fixedDecimalPlaces: false,
  decimalSeparator: '.',
  allowFloat: false,
  noButtons: false,
  stepSize: 1,
  keepFocusOnQuickChangeButton: true,
};

export const ARD_NUMBER_INPUT_DEFAULTS = new InjectionToken<ArdNumberInputDefaults>('ard-number-input-defaults', {
  factory: () => ({
    ..._numberInputDefaults,
  }),
});

export function provideNumberInputDefaults(config: Partial<ArdNumberInputDefaults>): Provider {
  return { provide: ARD_NUMBER_INPUT_DEFAULTS, useValue: { ..._numberInputDefaults, ...config } };
}
