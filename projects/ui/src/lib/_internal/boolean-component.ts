
import { EventEmitter, HostBinding, Input, Output, Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '../../../../devkit/src/public-api';
import { _NgModelComponent } from './ngmodel-component';


/**
 * Common code for components, which only operate on the "selected" state.
 */
@Directive()
export abstract class _BooleanComponent extends _NgModelComponent implements ControlValueAccessor {
    //* control value accessor
    writeValue(v: any): void {
        this._selected = Boolean(v);
    }
    //emitter function
    protected _emitChange() {
        this._onChangeRegistered?.(this.selected);
        this.selectedChange.emit(this.selected);
        this.changeEvent.emit(this.selected);
    }

    //* events
    @Output('select') selectEvent = new EventEmitter<null>();
    @Output('unselect') unselectEvent = new EventEmitter<null>();
    @Output('change') changeEvent = new EventEmitter<boolean>();

    //* [(selected)] two-way binding
    // can be set using a no-value argument
    protected _selected: boolean = false;
    @Input()
    @HostBinding('attr.selected')
    @HostBinding('class.ard-selected')
    get selected(): boolean { return this._selected };
    set selected(v: any) { this._selected = coerceBooleanProperty(v); }
    @Output() selectedChange = new EventEmitter<boolean>();

    toggleSelected() {
        this._selected = !this._selected;
        if (this._selected) this.selectEvent.emit(null);
        else this.unselectEvent.emit(null);

        this._emitChange();
    }
}