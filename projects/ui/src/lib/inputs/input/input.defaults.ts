import { InjectionToken, Provider } from '@angular/core';
import { _formFieldComponentDefaults } from '../../_internal/form-field-component';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _SimpleInputComponentDefaults } from '../_simple-input-base';

export interface ArdInputDefaults extends _SimpleInputComponentDefaults {}

const _simpleInputDefaults: ArdInputDefaults = {
  ..._formFieldComponentDefaults,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  compact: false,
  placeholder: '',
  alignText: SimpleOneAxisAlignment.Left,
  clearable: false,
  clearButtonTitle: 'Clear',
  inputAttrs: {},
  maxLength: undefined,
};

export const ARD_SIMPLE_INPUT_DEFAULTS = new InjectionToken<ArdInputDefaults>('ard-input-defaults', {
  factory: () => ({
    ..._simpleInputDefaults,
  }),
});

export function provideInputDefaults(config: Partial<ArdInputDefaults>): Provider {
  return { provide: ARD_SIMPLE_INPUT_DEFAULTS, useValue: { ..._simpleInputDefaults, ...config } };
}
