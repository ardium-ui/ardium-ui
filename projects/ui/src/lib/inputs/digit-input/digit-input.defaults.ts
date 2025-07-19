import { InjectionToken, Provider } from '@angular/core';
import { _FormFieldComponentDefaults, _formFieldComponentDefaults } from '../../_internal/form-field-component';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';
import { DigitInputAutoFillParseFn, DigitInputShape, DigitInputTransform } from './digit-input.types';

export interface ArdDigitInputDefaults extends _FormFieldComponentDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  shape: DigitInputShape;
  compact: boolean;
  outputAsString: boolean;
  transform: DigitInputTransform;
  inputAttrs: Record<string, any>;
  autoFillParseFn: DigitInputAutoFillParseFn;
}

const _digitInputDefaults: ArdDigitInputDefaults = {
  ..._formFieldComponentDefaults,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  shape: DigitInputShape.Square,
  compact: false,
  outputAsString: false,
  transform: null,
  inputAttrs: {},
  autoFillParseFn: v => v,
};

export const ARD_DIGIT_INPUT_DEFAULTS = new InjectionToken<ArdDigitInputDefaults>('ard-digit-input-defaults', {
  factory: () => ({
    ..._digitInputDefaults,
  }),
});

export function provideDigitInputDefaults(config: Partial<ArdDigitInputDefaults>): Provider {
  return { provide: ARD_DIGIT_INPUT_DEFAULTS, useValue: { ..._digitInputDefaults, ...config } };
}
