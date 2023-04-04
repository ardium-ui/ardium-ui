
import { EventEmitter, HostBinding, Input, Output, Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '../../../../devkit/src/public-api';
import { _NgModelComponentBase } from './ngmodel-component';


/**
 * Common code for components, which only operate on the "selected" state.
 */
@Directive()
export abstract class _BooleanComponentBase extends _NgModelComponentBase implements ControlValueAccessor {
    //! control value accessor
    writeValue(v: any): void {
        this.selected = v;
    }
    //emitter function
    protected _emitChange() {
        this._onChangeRegistered?.(this.selected);

        if (this._selected) this.selectEvent.emit(null);
        else this.unselectEvent.emit(null);
        
        this.selectedChange.emit(this.selected);
        this.changeEvent.emit(this.selected);
    }

    //! events
    @Output('select') selectEvent = new EventEmitter<null>();
    @Output('unselect') unselectEvent = new EventEmitter<null>();
    @Output('change') changeEvent = new EventEmitter<boolean>();

    //! [(selected)] two-way binding
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

        this._emitChange();
    }
}