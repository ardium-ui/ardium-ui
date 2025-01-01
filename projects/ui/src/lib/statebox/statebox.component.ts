import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, computed, effect, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _NgModelComponentBase } from './../_internal/ngmodel-component';
import { ArdiumStarButtonComponent } from './../star/star-button/star-button.component';
import { ClickStrategy } from './../types/utility.types';
import { ARD_STATEBOX_DEFAULTS, ArdStateboxDefaults } from './statebox.defaults';
import { StateboxState, StateboxValue, _StateboxInternalState } from './statebox.types';

@Component({
  selector: 'ard-statebox',
  templateUrl: './statebox.component.html',
  styleUrls: ['./statebox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumStarButtonComponent),
      multi: true,
    },
  ],
})
export class ArdiumStateboxComponent extends _NgModelComponentBase implements ControlValueAccessor {
  protected override readonly _DEFAULTS!: ArdStateboxDefaults;
  constructor(@Inject(ARD_STATEBOX_DEFAULTS) defaults: ArdStateboxDefaults) {
    super(defaults);

    effect(() => {
      this.state(); // let the effect know when to fire
      this._emitChange();
    });
  }

  readonly states = input<StateboxState[]>(this._DEFAULTS.states);
  readonly _states = computed(() => this.states().map(this._stateMapFn));
  readonly _defaultState = computed(() => this._states()[0]);

  readonly clickStrategy = input<ClickStrategy>(this._DEFAULTS.clickStrategy);

  readonly wrapperClasses = input<string>('');

  //! appearance

  readonly ngClasses = computed<string>(() =>
    [
      this.wrapperClasses(),
      this.internalState().useCustomColor ? 'ard-color-custom' : `ard-color-${this.internalState().color}`,
      this.internalState().filled ? 'ard-statebox-filled' : '',
      this.internalState().keepFrame ? 'ard-statebox-keep-frame' : '',
    ].join(' ')
  );

  //! state handlers
  readonly state = model<StateboxValue>(this._defaultState().value);
  private readonly _stateIndex = computed<number>(() => {
    const v = this.state();
    const foundStateIndex = this._states().findIndex(state => state.value === v);
    return foundStateIndex === -1 ? 0 : foundStateIndex;
  });
  readonly internalState = computed<_StateboxInternalState>(() => this._states()[this._stateIndex()]);

  writeValue(v: StateboxValue) {
    this.state.set(v);
  }

  //! change handlers
  private _stateMapFn(state: StateboxState): _StateboxInternalState {
    let display: string;
    let displayAsIcon = false;
    let keepFrame = true;

    if (state.icon) {
      display = state.icon;
      displayAsIcon = true;
      keepFrame = false;
    } else if (state.character) {
      display = state.character.substring(0, 1);
    } else {
      display = '';
    }
    return {
      value: state.value,
      display,
      displayAsIcon,
      color: state.color ?? state.customColor ?? 'none',
      useCustomColor: state.color ? false : true,
      colorOnCustom: state.colorOnCustom,
      filled: state.filled ?? false,
      keepFrame: state.keepFrame ?? keepFrame,
    };
  }

  //! event handlers
  onClick() {
    if (this.clickStrategy() === ClickStrategy.Noop) {
      return;
    }

    let newIndex = this._stateIndex() + 1;
    if (newIndex >= this._states().length) {
      newIndex = 0;
    }
    this.state.set(this._states()[newIndex].value);
  }

  protected _emitChange() {
    this._onChangeRegistered?.(this.state());
  }

  readonly ngStyle = computed<Record<string, any>>(() => {
    let customColor = null;
    const state = this.internalState();
    if (state.useCustomColor) {
      customColor = state.color;
    }
    return {
      '--ard-custom-color': customColor,
      '--ard-on-custom-color': state.colorOnCustom ?? '#fff',
    };
  });
}
