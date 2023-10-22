import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { isAnyString, isNull } from 'simple-bool';

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
export class ArdiumDigitInputComponent extends _NgModelComponentBase implements ControlValueAccessor {

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

    //! control value accessor's write value implementation
    writeValue(v: any): boolean {
        if (!isAnyString(v) && !isNull(v)) {
            //warn when using non-string/non-null value
            console.warn(new Error(`Trying to set digit-input's value to ${typeof v}, expected string.`));
            //normalize the value
            v = v?.toString?.() ?? String(v);
        }
        return this._writeValue(v);
    }
    private _writeValue(v: string | null): boolean {
        //update view
        let oldVal = this.value;
        this.value = v;
        this._updateInputElements();
        return oldVal !== v;
    }

    private _updateInputElements() { //TODO

    }
    //! value two-way binding
    private _outputAsString: boolean = false;
    @Input()
    get outputAsString(): boolean { return this._outputAsString; }
    set outputAsString(v: any) { this._outputAsString = coerceBooleanProperty(v); }

    private _value: (string | null)[] | null = null;
    @Input()
    set value(v: string | (string | null)[] | null) {
        this.writeValue(v);
    }
    get value(): (string | null)[] | null { return this._value; }
    @Output() valueChange = new EventEmitter<string | (string | null)[] | null>();

    get stringValue(): string {
        return this.value?.map(ch => ch ?? ' ').join('').trimEnd() ?? '';
    }

    get emittableValue(): string | (string | null)[] | null {
        if (this.outputAsString) return this.stringValue;
        return this.value;
    }

    //! event emitters
    @Output('input') inputEvent = new EventEmitter<string | (string | null)[] | null>();
    @Output('change') changeEvent = new EventEmitter<string | (string | null)[] | null>();

    //! event handlers
    onInput(newVal: string): void {
        let valueHasChanged = this.writeValue(newVal);
        if (!valueHasChanged) return;
        this._emitInput();
    }
    private _emitInput(): void {
        this._onChangeRegistered?.(this.value);
        this.inputEvent.emit(this.emittableValue);
        this.valueChange.emit(this.emittableValue);
    }
    //focus, blur, change
    onFocusMaster(event: FocusEvent): void {
        this.onFocus(event);
    }
    onBlurMaster(event: FocusEvent): void {
        this._emitChange();
        this.onBlur(event);
    }
    protected _emitChange(): void {
        this.changeEvent.emit(this.emittableValue);
    }
}
