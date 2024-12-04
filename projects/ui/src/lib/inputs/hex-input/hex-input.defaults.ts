import { InjectionToken, Provider } from '@angular/core';
import { _NgModelComponentDefaults, _ngModelComponentDefaults } from '../../_internal/ngmodel-component';
import { Nullable } from '../../types/utility.types';
import { CaseTransformerType } from '../input-types';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';

export interface ArdHexInputDefaults extends _NgModelComponentDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  compact: boolean;
  placeholder: string;
  case: CaseTransformerType;
  maxDigits: Nullable<number>;
  hideHash: boolean;
  clearable: boolean;
  clearButtonTitle: string;
  inputAttrs: Record<string, any>;
}

const _hexInputDefaults: ArdHexInputDefaults = {
  ..._ngModelComponentDefaults,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  compact: false,
  placeholder: '',
  case: CaseTransformerType.NoChange,
  maxDigits: undefined,
  hideHash: false,
  clearable: false,
  clearButtonTitle: 'Clear',
  inputAttrs: {},
};

export const ARD_HEX_INPUT_DEFAULTS = new InjectionToken<ArdHexInputDefaults>('ard-hex-input-defaults', {
  factory: () => ({
    ..._hexInputDefaults,
  }),
});

export function provideHexInputDefaults(config: Partial<ArdHexInputDefaults>): Provider {
  return { provide: ARD_HEX_INPUT_DEFAULTS, useValue: { ..._hexInputDefaults, ...config } };
}
