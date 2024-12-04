import { InjectionToken, Provider } from '@angular/core';
import { _NgModelComponentDefaults, _ngModelComponentDefaults } from '../../_internal/ngmodel-component';
import { SimpleOneAxisAlignment } from './../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';
import { Nullable } from './../../types/utility.types';

export interface ArdInputDefaults extends _NgModelComponentDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  compact: boolean;
  placeholder: string;
  alignText: SimpleOneAxisAlignment;
  clearable: boolean;
  clearButtonTitle: string;
  inputAttrs: Record<string, any>;
  maxLength: Nullable<number>;
  suggValueFrom: string;
  suggLabelFrom: string;
  suggestionsLoadingText: string;
}

const _inputDefaults: ArdInputDefaults = {
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
  suggValueFrom: 'value',
  suggLabelFrom: 'label',
  suggestionsLoadingText: 'Loading...',
};

export const ARD_INPUT_DEFAULTS = new InjectionToken<ArdInputDefaults>('ard-input-defaults', {
  factory: () => ({
    ..._inputDefaults,
  }),
});

export function provideInputDefaults(config: Partial<ArdInputDefaults>): Provider {
  return { provide: ARD_INPUT_DEFAULTS, useValue: { ..._inputDefaults, ...config } };
}
