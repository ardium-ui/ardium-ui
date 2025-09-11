import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    Input,
    ViewEncapsulation,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { TakeChance as Random } from 'take-chance';
import { _FocusableComponentBase } from '../../_internal/focusable-component';
import { SimpleComponentColor } from '../../types/colors.types';
import { ARD_RADIO_DEFAULTS, ArdRadioDefaults } from './radio.defaults';

@Component({
  standalone: false,
  selector: 'ard-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumRadioComponent extends _FocusableComponentBase {
  protected readonly _changeDetector = inject(ChangeDetectorRef);

  protected override readonly _DEFAULTS!: ArdRadioDefaults;
  constructor(@Inject(ARD_RADIO_DEFAULTS) defaults: ArdRadioDefaults) {
    super(defaults);
  }

  readonly htmlId = input<string>(Random.id());

  /**
   * Emits all select-state-related events.
   */
  protected _emitChange() {
    if (this.selected()) this.selectEvent.emit(null);
    else this.unselectEvent.emit(null);

    this.selectedChange.emit(this.selected());
    this.changeEvent.emit(this.selected());
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
  /**
   * The event emitter responsible for firing `change` events. Fired when the `selected` state is changed.
   */
  readonly changeEvent = output<boolean>({ alias: 'change' });

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
  readonly selectedChange = output<boolean>();

  /**
   * Toggles the selected state. Emits all appropriate events.
   */
  toggleSelected() {
    this.selected.update(v => !v);
    this._emitChange();
  }

  /**
   * Sets the state to "selected". Emits all appropriate events only if the state changes.
   */
  select() {
    this.selected.set(true);
    this._emitChange();
  }
  /**
   * Sets the state to "unselected". Emits all appropriate events only if the state changes.
   */
  unselect() {
    this.selected.set(false);
    this._emitChange();
  }

  readonly value = input<any>();

  //! appearance
  readonly color = input<SimpleComponentColor>(this._DEFAULTS.color);

  readonly ngClasses = computed<string>(() =>
    [`ard-color-${this.color()}`, `ard-radio-${this.selected() ? 'selected' : 'unselected'}`].join(' ')
  );

  //! event handlers
  onMousedown(): void {
    this.focus();
  }
  onMouseup(): void {
    this.focus();
    this.selected.set(true);
    this._emitChange();
  }

  //! radio-group access points
  readonly name = signal<string | null>(null);

  /**
   * Marks the radio button as needing checking for change detection.
   * This method is exposed because the parent radio group will directly
   * update bound properties of the radio button.
   */
  markForCheck() {
    // When group value changes, the button will not be notified. Use `markForCheck` to explicit
    // update radio button's status
    this._changeDetector.markForCheck();
  }
}
