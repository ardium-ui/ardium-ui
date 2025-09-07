import { InjectionToken } from '@angular/core';

export interface ArdFormFieldControl {
  hasError: (() => boolean) | boolean;
  isSuccess?: (() => boolean) | boolean;
  disabled: (() => boolean) | boolean;
  htmlId: (() => string) | string;
  // removed for now
  // will bring back when I figure out how (and if) to pass it onto the label
  // required?: (() => boolean) | boolean;
}

export const ARD_FORM_FIELD_CONTROL = new InjectionToken<ArdFormFieldControl>('ard-form-field-control');
