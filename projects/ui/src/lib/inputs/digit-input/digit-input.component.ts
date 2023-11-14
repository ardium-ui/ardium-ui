import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, Output, EventEmitter, Input, ViewChildren, QueryList, AfterViewInit, AfterContentInit, ElementRef } from '@angular/core';
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
export class ArdiumDigitInputComponent extends _NgModelComponentBase implements ControlValueAccessor, DigitInputModelHost, AfterContentInit {

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
    configArrayData: DigitInputConfigData[] = [];

    get isConfigDefined(): boolean { return this.model.isConfigDefined; }

    //! control value accessor's write value implementation
    writeValue(v: any): void {
        this._writeValue(v);
    }
    private _writeValue(v: any): boolean {
        return this.model.writeValue(v);
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
    @Output() finishedValue = new EventEmitter<string | (string | null)[] | null>();

    @Output('focusIndex') focusIndexEvent = new EventEmitter<number>();
    @Output('blurIndex') blurIndexEvent = new EventEmitter<number>();

    //! event handlers
    onPaste(event: ClipboardEvent, index: number): void {
        const value = event.clipboardData?.getData('text');
        event.stopPropagation();
        event.preventDefault();
        if (!value) return;

        const maxLength = this.inputs.length - index
        value.slice(0, maxLength).split('').forEach((char, i) => {
            this.model.validateInputAndSetValue(char, index + i);
        });
        this.focusByIndex(index - 1 + Math.min(value.length, maxLength));
    }
    onInput(event: Event, index: number): void {
        this._updateSingleInputValue((event.target as HTMLInputElement).value, index);
    }
    private _updateSingleInputValue(value: string, index: number): void {
        const valueChanged = this.model.validateInputAndSetValue(value, index);
        console.log(value, index, valueChanged);
        if (!valueChanged || !valueChanged[0]) return;

        if (valueChanged[1]) {
            this.focusByIndex(index + 1);
        }
        this._emitInput();
    }
    focusByIndex(index: number): void {
        if (index < 0 || index >= this.inputs.length) return;
        const nextEl = this.inputs.get(index)?.nativeElement;
        if (!nextEl) return;

        nextEl.focus();
    }
    private _emitInput(): void {
        this._onChangeRegistered?.(this.value);
        this.inputEvent.emit(this.emittableValue);
        this.valueChange.emit(this.emittableValue);
        if (this.model.isValueFull) {
            this.finishedValue.emit(this.emittableValue);
        }
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
    onKeydown(event: KeyboardEvent, index: number): void {
        switch (event.key) {
            case 'ArrowLeft':
                this.focusByIndex(index - 1);
                break;
            case 'ArrowRight':
                this.focusByIndex(index + 1);
                break;
            case 'Home':
                this.focusByIndex(0);
                break;
            case 'End':
                this.focusByIndex(this.inputs.length - 1);
                break;
            case 'Backspace':
            case 'Delete':
                this._updateSingleInputValue('', index);
                this.focusByIndex(index - 1);
                event.preventDefault();
                break;
        
            default:
                break;
        }
    }

    //! inputs ref
    @ViewChildren('input') inputs!: QueryList<ElementRef<HTMLInputElement>>;

    ngAfterContentInit(): void {
        if (!this.isConfigDefined) {
            throw new Error(`ARD-FT040: <ard-digit-input>'s [config] field has to be defined.`);
        }
    }
}
