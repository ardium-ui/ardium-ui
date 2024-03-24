import { EventEmitter, HostBinding, Input, Output, Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
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
    /**
     * Emits all select-state-related events.
     */
    protected _emitChange() {
        this._onChangeRegistered?.(this.selected);

        if (this._selected) this.selectEvent.emit(null);
        else this.unselectEvent.emit(null);

        this.selectedChange.emit(this.selected);
        this.changeEvent.emit(this.selected);
    }

    //! events
    /**
     * The event emitter responsible for firing `select` events. Fired when the `selected` state is set to true.
     */
    @Output('select') selectEvent = new EventEmitter<null>();
    /**
     * The event emitter responsible for firing `unselect` events. Fired when the `selected` state is set to false.
     */
    @Output('unselect') unselectEvent = new EventEmitter<null>();
    /**
     * The event emitter responsible for firing `change` events. Fired when the `selected` state is changed.
     */
    @Output('change') changeEvent = new EventEmitter<boolean>();

    //! [(selected)] two-way binding
    // can be set using a no-value argument
    protected _selected: boolean = false;
    /**
     * The selection state of the component. Coercible into a boolean.
     */
    @Input()
    @HostBinding('attr.selected')
    @HostBinding('class.ard-selected')
    get selected(): boolean {
        return this._selected;
    }
    set selected(v: any) {
        this._selected = coerceBooleanProperty(v);
    }
    /**
     * The event emitter responsible for firing `selectedChange` events. Fired when the `selected` state is changed.
     */
    @Output() selectedChange = new EventEmitter<boolean>();

    /**
     * Toggles the selected state. Emits all appropriate events.
     */
    toggleSelected() {
        this._selected = !this._selected;

        this._emitChange();
    }

    /**
     * Sets the state to "selected". Emits all appropriate events only if the state changes.
     */
    select() {
        const oldState = this._selected;
        this._selected = true;

        if (oldState != true) this._emitChange();
    }
    /**
     * Sets the state to "unselected". Emits all appropriate events only if the state changes.
     */
    unselect() {
        const oldState = this._selected;
        this._selected = false;

        if (oldState != false) this._emitChange();
    }
}
