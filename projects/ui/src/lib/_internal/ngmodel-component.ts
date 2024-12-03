import { Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { _FocusableComponentBase, _focusableComponentDefaults, _FocusableComponentDefaults } from './focusable-component';

export interface _NgModelComponentDefaults extends _FocusableComponentDefaults {  };

export const _ngModelComponentDefaults: _NgModelComponentDefaults = _focusableComponentDefaults;

/**
 * Common code for components which implement the ControlValueAccessor.
 *
 * **Warning**: `writeValue` function should be implemented on the child component!
 */
@Directive()
export abstract class _NgModelComponentBase extends _FocusableComponentBase implements ControlValueAccessor {
  protected override readonly _DEFAULTS: _NgModelComponentDefaults = _ngModelComponentDefaults;

  //! control value accessor
  protected _onChangeRegistered!: (_: any) => void;
  protected _onTouchedRegistered!: () => void;
  /**
   * Registers a function to handle touched state. Required by ControlValueAccessor.
   * @param fn The function to register.
   */
  registerOnTouched(fn: () => void): void {
    this._onTouchedRegistered = fn;
  }
  /**
   * Registers a function to handle value change. Required by ControlValueAccessor.
   * @param fn The function to register.
   */
  registerOnChange(fn: (_: any) => void): void {
    this._onChangeRegistered = fn;
  }
  /**
   * Sets the component's disabled state. Required by ControlValueAccessor.
   * @param isDisabled the new disabled state.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  /**
   * Writes the a new value into the component. Required by ControlValueAccessor.
   * @abstract
   * @param v The new value to write.
   */
  abstract writeValue(v: any): void; //* abstract

  /**
   * Writes the a new value into the component. Required by ControlValueAccessor.
   * @abstract
   * @param v The new value to write.
   */
  protected abstract _emitChange(): void; //* abstract

  //! event handlers
  override onBlur(event: FocusEvent) {
    super.onBlur(event);
    this._onTouchedRegistered?.();
  }
}
