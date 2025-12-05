import { Directive, model, output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { _NgModelComponentBase, _ngModelComponentDefaults, _NgModelComponentDefaults } from './ngmodel-component';

export interface _BooleanComponentDefaults extends _NgModelComponentDefaults {}
export const _booleanComponentDefaults: _BooleanComponentDefaults = _ngModelComponentDefaults;

/**
 * Common code for components, which only operate on the "selected" state.
 */
@Directive()
export abstract class _BooleanComponentBase
  extends _NgModelComponentBase
  implements ControlValueAccessor, FormValueControl<boolean>
{
  protected override readonly _DEFAULTS!: _BooleanComponentDefaults;

  //! control value accessor
  writeValue(v: any): void {
    this.value.set(v);
  }
  //emitter function
  /**
   * Emits all select-state-related events.
   */
  protected _emitChange() {
    this._onChangeRegistered?.(this.value());

    if (this.value()) this.selectEvent.emit(null);
    else this.unselectEvent.emit(null);
  }

  //! events
  /**
   * The event emitter responsible for firing `select` events. Fired when the `selected` state is set to true.
   */
  readonly selectEvent = output<null>({ alias: 'select' });
  /**
   * The event emitter responsible for firing `unselect` events. Fired when the `selected` state is set to false.
   */
  readonly unselectEvent = output<null>({ alias: 'unselect' });

  //! [(value)] two-way binding
  readonly value = model<boolean>(false);

  /**
   * Toggles the selected state. Emits all appropriate events.
   */
  toggleSelected() {
    this.value.update(v => !v);
    this._emitChange();
  }

  /**
   * Sets the state to "selected". Emits all appropriate events only if the state changes.
   */
  select() {
    this.value.set(true);
    this._emitChange();
  }
  /**
   * Sets the state to "unselected". Emits all appropriate events only if the state changes.
   */
  unselect() {
    this.value.set(false);
    this._emitChange();
  }
}
