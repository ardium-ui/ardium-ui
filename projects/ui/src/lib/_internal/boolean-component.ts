import { Directive, EventEmitter, HostBinding, Input, Output, effect, signal } from '@angular/core';
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
    this._selected = v;
  }
  //emitter function
  /**
   * Emits all select-state-related events.
   */
  protected _emitChange() {
    this._onChangeRegistered?.(this.selected());

    if (this._selected) this.selectEvent.emit(null);
    else this.unselectEvent.emit(null);

    this.selectedChange.emit(this.selected());
    this.changeEvent.emit(this.selected());
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
  readonly selected = signal<boolean>(false);
  /**
   * The selection state of the component. Coercible into a boolean.
   */
  @Input('selected')
  set _selected(v: any) {
    this.selected.set(coerceBooleanProperty(v));
  }
  @HostBinding('attr.selected')
  @HostBinding('class.ard-selected')
  get _selectedHostAttribute(): boolean {
    return this.selected();
  }
  /**
   * The event emitter responsible for firing `selectedChange` events. Fired when the `selected` state is changed.
   */
  @Output() selectedChange = new EventEmitter<boolean>();

  constructor() {
    super();

    effect(() => {
      this.selected(); // call the signal to let the effect know when to update
      this._emitChange();
    });
  }

  /**
   * Toggles the selected state. Emits all appropriate events.
   */
  toggleSelected() {
    this.selected.update(v => !v);
  }

  /**
   * Sets the state to "selected". Emits all appropriate events only if the state changes.
   */
  select() {
    this.selected.set(true);
  }
  /**
   * Sets the state to "unselected". Emits all appropriate events only if the state changes.
   */
  unselect() {
    this.selected.set(false);
  }
}
