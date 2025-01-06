import { InjectionToken, Provider } from '@angular/core';
import { _NgModelComponentDefaults, _ngModelComponentDefaults } from '../../_internal/ngmodel-component';
import { OneAxisAlignment } from './../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';

export interface ArdNumberInputDefaults extends _NgModelComponentDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  compact: boolean;
  placeholder: string;
  alignText: OneAxisAlignment;
  inputAttrs: Record<string, any>;
  min: number;
  max: number;
  allowFloat: boolean;
  noButtons: boolean;
  stepSize: number;
}

const _numberInputDefaults: ArdNumberInputDefaults = {
  ..._ngModelComponentDefaults,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  compact: false,
  placeholder: '',
  alignText: OneAxisAlignment.Middle,
  inputAttrs: {},
  min: 0,
  max: Infinity,
  allowFloat: false,
  noButtons: false,
  stepSize: 1,
};

export const ARD_NUMBER_INPUT_DEFAULTS = new InjectionToken<ArdNumberInputDefaults>('ard-number-input-defaults', {
  factory: () => ({
    ..._numberInputDefaults,
  }),
});

export function provideNumberInputDefaults(config: Partial<ArdNumberInputDefaults>): Provider {
  return { provide: ARD_NUMBER_INPUT_DEFAULTS, useValue: { ..._numberInputDefaults, ...config } };
}
