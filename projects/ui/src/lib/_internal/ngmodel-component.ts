import { Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { _FocusableComponent } from './focusable-component';

/**
 * Common code for components, which implement the ControlValueAccessor.
 * 
 * **Warning**: `writeValue` function should be implemented on the child component!
 */
@Directive()
export abstract class _NgModelComponent extends _FocusableComponent implements ControlValueAccessor {
    //* control value accessor
    protected _onChangeRegistered!: (_: any) => void;
    protected _onTouchedRegistered!: () => void;
    registerOnTouched(fn: () => void): void {
        this._onTouchedRegistered = fn;
    }
    registerOnChange(fn: (_: any) => {}): void {
        this._onChangeRegistered = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this._disabled = isDisabled;
    }
    //! needs to be overridden in the child component!
    abstract writeValue(obj: any): void;

    //* event handlers
    override onFocus(event: FocusEvent) {
        this.focusEvent.emit(event);
    }
    override onBlur(event: FocusEvent) {
        this.blurEvent.emit(event);
        this._onTouchedRegistered?.();
    }
}
