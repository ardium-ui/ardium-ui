import { InjectionToken, Provider } from '@angular/core';
import { _formFieldComponentDefaults } from '../../_internal/form-field-component';
import { _SimpleInputComponentDefaults } from '../_simple-input-base';
import { SimpleOneAxisAlignment } from './../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';

export interface ArdSimpleInputDefaults extends _SimpleInputComponentDefaults {}

const _simpleInputDefaults: ArdSimpleInputDefaults = {
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

export const ARD_SIMPLE_INPUT_DEFAULTS = new InjectionToken<ArdSimpleInputDefaults>('ard-simple-input-defaults', {
  factory: () => ({
    ..._simpleInputDefaults,
  }),
});

export function provideSimpleInputDefaults(config: Partial<ArdSimpleInputDefaults>): Provider {
  return { provide: ARD_SIMPLE_INPUT_DEFAULTS, useValue: { ..._simpleInputDefaults, ...config } };
}
