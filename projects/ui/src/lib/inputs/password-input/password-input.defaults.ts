import { InjectionToken, Provider } from '@angular/core';
import { _NgModelComponentDefaults, _ngModelComponentDefaults } from '../../_internal/ngmodel-component';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';
import { Nullable } from './../../types/utility.types';

export interface ArdPasswordInputDefaults extends _NgModelComponentDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  compact: boolean;
  placeholder: string;
  revealable: boolean;
  holdToReveal: boolean;
  autoHideTimeoutMs: Nullable<number>;
  revealed: boolean;
  inputAttrs: Record<string, any>;
}

const _passwordInputDefaults: ArdPasswordInputDefaults = {
  ..._ngModelComponentDefaults,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  compact: false,
  placeholder: '',
  revealable: true,
  holdToReveal: false,
  autoHideTimeoutMs: undefined,
  revealed: false,
  inputAttrs: {},
};

export const ARD_PASSWORD_INPUT_DEFAULTS = new InjectionToken<ArdPasswordInputDefaults>('ard-password-input-defaults', {
  factory: () => ({
    ..._passwordInputDefaults,
  }),
});

export function providePasswordInputDefaults(config: Partial<ArdPasswordInputDefaults>): Provider {
  return { provide: ARD_PASSWORD_INPUT_DEFAULTS, useValue: { ..._passwordInputDefaults, ...config } };
}
