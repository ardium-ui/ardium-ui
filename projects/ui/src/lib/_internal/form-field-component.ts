import { Directive, inject, Injector, input, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
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
export abstract class _FormFieldComponentBase extends _NgModelComponentBase implements ControlValueAccessor, OnInit {
  protected override readonly _DEFAULTS!: _FormFieldComponentDefaults;

  protected readonly _injector = inject(Injector);

  ngOnInit(): void {
    this._ngControl = this._injector.get(NgControl, null);

    if (this._ngControl) {
      this._ngControl.valueAccessor = this;
    }
  }
  protected _ngControl: NgControl | null = null;

  readonly _required = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v), alias: 'required' });
  get required() {
    return this._required() || !!this._ngControl?.control?.hasValidator(Validators.required);
  }

  // readonly _statusSignal = this._ngControl?.statusChanges ? toSignal(this._ngControl?.statusChanges) : signal(null);
  // readonly _isStatusInvalid = computed(() => this._statusSignal() === 'INVALID');

  readonly _hasError = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v), alias: 'hasError' });
  get hasError() {
    return this._hasError() || !!this._ngControl?.control?.invalid;
  }
}
