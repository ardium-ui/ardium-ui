import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _NgModelComponentBase } from './../_internal/ngmodel-component';
import { StateboxState, StateboxValue, _StateboxInternalState, _StateboxInternalStateData } from './statebox.types';
import { ArdiumStarButtonComponent } from './../star/star-button/star-button.component';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

const defaultStateboxStates: StateboxState[] = [
  { value: false, color: 'none' },
  { value: true, color: 'secondary', icon: 'check', fillMode: true },
];

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
  readonly states = input<StateboxState[]>(defaultStateboxStates);
  readonly _states = computed(() => this.states().map(this._stateMapFn));
  readonly _defaultState = computed(() => this._states()[0]);

  readonly manualStateHandling = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly wrapperClasses = input<string>('');

  //! appearance

  readonly ngClasses = computed<string>(() =>
    [
      this.wrapperClasses(),
      this.internalState().useCustomColor ? 'ard-color-custom' : `ard-color-${this.internalState().color}`,
      this.internalState().fillMode ? 'ard-statebox-filled' : '',
      this.internalState().keepFrame ? 'ard-statebox-keep-frame' : '',
    ].join(' ')
  );

  //! events
  readonly changeEvent = output<StateboxValue>({ alias: 'change' });
  readonly clickEvent = output<MouseEvent>({ alias: 'click' });

  constructor() {
    super();
    effect(() => {
      this.state(); // let the effect know when to fire
      this._emitChange();
    });
  }

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
      colorOnCustomColor: state.colorOnCustomColor,
      fillMode: state.fillMode ?? false,
      keepFrame: state.keepFrame ?? keepFrame,
    };
  }

  //! event handlers
  onClick(event: MouseEvent) {
    if (this.manualStateHandling()) {
      this.clickEvent.emit(event);
      return;
    }

    let newIndex = this._stateIndex() + 1;
    if (newIndex >= this._states().length) {
      newIndex = 0;
    }
    this.state.set(this._states()[newIndex].value);
  }

  protected _emitChange() {
    const s = this.state();
    this._onChangeRegistered?.(s);
    this.changeEvent.emit(s);
  }

  readonly ngStyle = computed<{ [cls: string]: any }>(() => {
    let customColor = null;
    const state = this.internalState();
    if (state.useCustomColor) {
      customColor = state.color;
    }
    return {
      '--ard-custom-color': customColor,
      '--ard-on-custom-color': state.colorOnCustomColor ?? '#fff',
    };
  })
}
