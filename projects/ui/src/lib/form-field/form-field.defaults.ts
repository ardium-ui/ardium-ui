import { InjectionToken, Provider } from '@angular/core';
import { SimpleOneAxisAlignment } from './../types/alignment.types';

export interface ArdFormFieldDefaults {
  defaultHintAlign: SimpleOneAxisAlignment;
  reserveHintLine: boolean;
  labelRequiredText: string;
  labelOptionalText: string;
  autoErrorOnlyFirstError: boolean;
}

const _formFieldDefaults: ArdFormFieldDefaults = {
  defaultHintAlign: SimpleOneAxisAlignment.Left,
  reserveHintLine: false,
  labelRequiredText: '*',
  labelOptionalText: '(optional)',
  autoErrorOnlyFirstError: true,
};

export const ARD_FORM_FIELD_DEFAULTS = new InjectionToken<ArdFormFieldDefaults>('ard-form-field-defaults', {
  factory: () => ({
    ..._formFieldDefaults,
  }),
});

export function provideFormFieldDefaults(config: Partial<ArdFormFieldDefaults>): Provider {
  return { provide: ARD_FORM_FIELD_DEFAULTS, useValue: { ..._formFieldDefaults, ...config } };
}
