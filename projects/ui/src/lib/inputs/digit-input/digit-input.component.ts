import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, Output, EventEmitter, Input, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { DigitInputConfig, DigitInputConfigData, DigitInputModel, DigitInputModelHost } from './digit-input.model';

@Component({
    selector: 'ard-digit-input',
    templateUrl: './digit-input.component.html',
    styleUrls: ['./digit-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumDigitInputComponent),
            multi: true
        }
    ]
})
export class ArdiumDigitInputComponent extends _NgModelComponentBase implements ControlValueAccessor, DigitInputModelHost, AfterViewInit {

    private readonly model = new DigitInputModel(this);

    //! appearance
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }

    //! model access points
    @Input()
    set config(v: DigitInputConfig) {
        this.model.setConfig(v);
    }

    get configArrayData(): DigitInputConfigData[] { return this.model.configArrayData; }

    //! control value accessor's write value implementation
    writeValue(v: any): void {
        this._writeValue(v);
    }
    private _writeValue(v: any): boolean {
        return this.model.writeValue(v);
    }

    //! input handler
    handleInput(event: Event, index: number): void {
        const valueChanged = this.model.validateInputAndSetValue((event.target as HTMLInputElement).value, index);
        if (!valueChanged) return;

        this._emitInput();
    }

    //! value two-way binding
    private _outputAsString: boolean = false;
    @Input()
    get outputAsString(): boolean { return this._outputAsString; }
    set outputAsString(v: any) { this._outputAsString = coerceBooleanProperty(v); }

    @Input()
    set value(v: string | (string | null)[] | null) {
        this.writeValue(v);
    }
    get value(): (string | null)[] | null { return this.model.value; }
    @Output() valueChange = new EventEmitter<string | (string | null)[] | null>();

    get stringValue(): string { return this.model.stringValue; }

    get emittableValue(): string | (string | null)[] | null {
        if (this.outputAsString) return this.model.stringValue;
        return this.value;
    }

    //! event emitters
    @Output('input') inputEvent = new EventEmitter<string | (string | null)[] | null>();
    @Output('change') changeEvent = new EventEmitter<string | (string | null)[] | null>();

    @Output('focusIndex') focusIndexEvent = new EventEmitter<number>();
    @Output('blurIndex') blurIndexEvent = new EventEmitter<number>();

    //! event handlers
    onInput(newVal: string): void {
        let valueHasChanged = this._writeValue(newVal);
        if (!valueHasChanged) return;
        this._emitInput();
    }
    private _emitInput(): void {
        this._onChangeRegistered?.(this.value);
        this.inputEvent.emit(this.emittableValue);
        this.valueChange.emit(this.emittableValue);
    }
    //focus, blur, change
    onFocusMaster(event: FocusEvent, index: number): void {
        this.focusIndexEvent.emit(index);
        this.onFocus(event);
    }
    onBlurMaster(event: FocusEvent, index: number): void {
        this._emitChange();
        this.blurIndexEvent.emit(index);
        this.onBlur(event);
    }
    protected _emitChange(): void {
        this.changeEvent.emit(this.emittableValue);
    }

    //! inputs ref
    @ViewChildren('.ard-digit-input__input') inputs!: QueryList<HTMLInputElement>;

    ngAfterViewInit(): void {
        console.log(this.inputs);
    }
}
