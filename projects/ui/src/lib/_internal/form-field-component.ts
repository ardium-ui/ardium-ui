import { Directive, input } from '@angular/core';
import { ControlValueAccessor, Validators } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ArdFormFieldControl } from '../form-field/form-field-child.token';
import { _NgModelComponentBase, _NgModelComponentDefaults, _ngModelComponentDefaults } from './ngmodel-component';

export interface _FormFieldComponentDefaults extends _NgModelComponentDefaults {
  required: boolean | undefined;
}

export const _formFieldComponentDefaults: _FormFieldComponentDefaults = {
  ..._ngModelComponentDefaults,
  required: undefined,
};

/**
 * Common code for components which implement the ControlValueAccessor.
 *
 * **Warning**: `writeValue` function should be implemented on the child component!
 */
@Directive()
export abstract class _FormFieldComponentBase extends _NgModelComponentBase implements ControlValueAccessor, ArdFormFieldControl {
  protected override readonly _DEFAULTS!: _FormFieldComponentDefaults;

  readonly _required = input<boolean | undefined, any>(undefined, {
    transform: v => coerceBooleanProperty(v),
    alias: 'required',
  });
  get required() {
    return this._required() ?? !!this._ngControl?.control?.hasValidator(Validators.required);
  }

  readonly isSuccess = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
}
