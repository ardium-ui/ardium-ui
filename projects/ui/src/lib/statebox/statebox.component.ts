import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _NgModelComponentBase } from './../_internal/ngmodel-component';
import { StateboxState, StateboxValue, _StateboxInternalState } from './statebox.types';
import { ArdiumStarButtonComponent } from './../star/star-button/star-button.component';

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
export class ArdiumStateboxComponent extends _NgModelComponentBase implements ControlValueAccessor, OnChanges {
    _states: _StateboxInternalState[] = defaultStateboxStates.map(this._stateMapFn);
    @Input() states?: StateboxState[];

    @Input() manualStateHandling: boolean = false;

    @Input() wrapperClasses: string = '';

    get ngClasses(): string {
        return [
            this.currState.useCustomColor ? 'ard-color-custom' : `ard-color-${this.currState.color}`,
            this.currState.fillMode ? 'ard-statebox-filled' : '',
            this.currState.keepFrame ? 'ard-statebox-keep-frame' : '',
        ].join(' ');
    }

    //* events
    @Output('change') changeEvent = new EventEmitter<StateboxValue>();
    @Output('click') clickEvent = new EventEmitter<MouseEvent>();

    //* state handlers
    private _state: _StateboxInternalState = this.defaultState;
    private _stateIndex: number = 0;
    @Input()
    set state(v: StateboxValue) {
        this.writeValue(v);
    }
    get state(): StateboxValue {
        return this._state.value;
    }
    @Output() stateChange = new EventEmitter<StateboxValue>();

    writeValue(v: StateboxValue) {
        for (let i = 0; i < this._states.length; i++) {
            const state = this._states[i];
            if (state.value === v) {
                this._state = state;
                this._stateIndex = i;
                return;
            }
        }
        this._state = this.defaultState;
        this._stateIndex = 0;
    }

    //* change handlers
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['states']) {
            const newVal = changes['states'].currentValue as StateboxState[];
            this._states = newVal.map(this._stateMapFn);
            this.writeValue(this._state.value);
        }
        if (changes['state']?.firstChange) {
            this.writeValue(changes['state'].currentValue);
        }
    }
    private _stateMapFn(state: StateboxState): _StateboxInternalState {
        let display: string;
        let displayAsIcon = false;
        let keepFrame = true;
        if (state.icon) {
            display = state.icon;
            displayAsIcon = true;
            let keepFrame = false;
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
    get defaultState(): _StateboxInternalState {
        return this._states[0];
    }

    //* event handlers
    onClick(event: MouseEvent) {
        if (this.manualStateHandling) {
            this.clickEvent.emit(event);
            return;
        }
        this._stateIndex++;
        if (this._stateIndex >= this._states.length) {
            this._stateIndex = 0;
        }
        this._state = this._states[this._stateIndex];
        this._emitChange();
    }
    //emitter_onChangeRegistered
    protected _emitChange() {
        this._onChangeRegistered?.(this.state);
        this.stateChange.emit(this.state);
        this.changeEvent.emit(this.state);
    }

    //* template helpers
    get currState(): _StateboxInternalState {
        return this._state;
    }
    get ngStyle(): { [klass: string]: any } {
        let customColor = null;
        if (this.currState.useCustomColor) {
            customColor = this.currState.color;
        }
        return {
            '--ard-custom-color': customColor,
            '--ard-on-custom-color': this.currState.colorOnCustomColor ?? '#fff',
        };
    }
}
