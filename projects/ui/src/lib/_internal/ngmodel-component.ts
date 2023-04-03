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
    //! control value accessor
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
    
    abstract writeValue(obj: any): void; //* abstract

    //! event handlers
    override onBlur(event: FocusEvent) {
        super.onBlur(event);
        this._onTouchedRegistered?.();
    }
}
