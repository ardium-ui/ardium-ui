import { InjectionToken, Provider } from '@angular/core';
import { _NgModelComponentDefaults, _ngModelComponentDefaults } from '../../_internal/ngmodel-component';
import { SimpleOneAxisAlignment } from './../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';
import { Nullable } from './../../types/utility.types';

export interface ArdSimpleInputDefaults extends _NgModelComponentDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  compact: boolean;
  placeholder: string;
  alignText: SimpleOneAxisAlignment;
  clearable: boolean;
  clearButtonTitle: string;
  inputAttrs: Record<string, any>;
  maxLength: Nullable<number>;
}

const _simpleInputDefaults: ArdSimpleInputDefaults = {
  ..._ngModelComponentDefaults,
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
