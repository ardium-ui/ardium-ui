import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
    ContentChild,
    TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import {
    ButtonVariant,
    ButtonAppearance,
} from '../../buttons/general-button.types';
import { OneAxisAlignment } from '../../types/alignment.types';
import {
    FormElementAppearance,
    FormElementVariant,
} from '../../types/theming.types';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { NumberInputModel, NumberInputModelHost } from '../input-utils';
import { isDefined, isFloat } from 'simple-bool';
import { ArdNumberInputPlaceholderTemplateDirective } from './number-input.directives';
import { roundToPrecision } from 'more-rounding';

@Component({
    selector: 'ard-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumNumberInputComponent),
            multi: true,
        },
    ],
})
export class ArdiumNumberInputComponent
    extends _NgModelComponentBase
    implements ControlValueAccessor, NumberInputModelHost, OnInit
{
    //! input view
    @ViewChild('textInput', { static: true })
    textInputEl!: ElementRef<HTMLInputElement>;
    protected inputModel!: NumberInputModel;
    ngOnInit(): void {
        this.inputModel = new NumberInputModel(
            this.textInputEl.nativeElement,
            this,
        );
        this._setInputAttributes();
        //set the value
        if (this._valueBeforeInit) {
            this.writeValue(this._valueBeforeInit);
            delete this._valueBeforeInit;
        }
    }

    @Input() inputId?: string;

    //! placeholder
    @Input() placeholder: string = '';

    @ContentChild(ArdNumberInputPlaceholderTemplateDirective, {
        read: TemplateRef,
    })
    placeholderTemplate?: TemplateRef<any>;

    get shouldDisplayPlaceholder(): boolean {
        return Boolean(this.placeholder) && !this.inputModel.stringValue;
    }

    //! appearance
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;
    @Input() alignText: OneAxisAlignment = OneAxisAlignment.Middle;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean {
        return this._compact;
    }
    set compact(v: any) {
        this._compact = coerceBooleanProperty(v);
    }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            `ard-text-align-${this.alignText}`,
            `ard-quick-change-${this.allowQuickChange}`,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }

    get buttonVariant(): ButtonVariant {
        if (this.variant == FormElementVariant.Rounded)
            return ButtonVariant.Rounded;
        if (this.variant == FormElementVariant.Pill) return ButtonVariant.Pill;
        if (this.variant == FormElementVariant.Sharp)
            return ButtonVariant.Sharp;
        return ButtonVariant.Rounded;
    }
    get buttonAppearance(): ButtonAppearance {
        if (
            this.appearance == FormElementAppearance.Outlined &&
            this.variant != FormElementVariant.Pill
        )
            return ButtonAppearance.Outlined;
        return ButtonAppearance.Transparent;
    }

    //! other inputs
    @Input() inputAttrs: { [key: string]: any } = {};

    //! control value accessor's write value implementation
    writeValue(v: any) {
        this.inputModel.writeValue(v);
    }

    //! value two-way binding
    protected _valueBeforeInit?: string | null = '0';
    @Input()
    set value(v: string | number | null) {
        if (typeof v == 'number') v = v.toString();
        if (!this.inputModel) {
            this._valueBeforeInit = v;
            return;
        }
        this.writeValue(v);
    }
    @Output() valueChange = new EventEmitter<number | null>();

    //* event emitters
    @Output('input') inputEvent = new EventEmitter<number | null>();
    @Output('change') changeEvent = new EventEmitter<number | null>();
    @Output('clear') clearEvent = new EventEmitter<MouseEvent>();
    @Output('quickChange') quickChangeEvent = new EventEmitter<{
        direction: 1 | -1;
        value: number;
    }>();

    //! min/max and number type
    private _min: number = 0;
    @Input()
    get min(): number {
        return this._min;
    }
    set min(v: any) {
        this._min = coerceNumberProperty(v);
    }

    private _max: number = 999;
    @Input()
    get max(): number {
        return this._max;
    }
    set max(v: any) {
        this._max = coerceNumberProperty(v);
    }

    private _allowFloat?: boolean = undefined;
    @Input()
    get allowFloat(): boolean {
        return this._allowFloat ?? isFloat(this._stepSize);
    }
    set allowFloat(v: any) {
        this._allowFloat = coerceBooleanProperty(v);
    }

    //! incerement/decrement buttons
    private _allowQuickChange: boolean = true;
    @Input()
    get allowQuickChange(): boolean {
        return this._allowQuickChange;
    }
    set allowQuickChange(v: any) {
        this._allowQuickChange = coerceBooleanProperty(v);
    }

    private _stepSize: number = 1;
    @Input()
    get stepSize(): number {
        return this._stepSize;
    }
    set stepSize(v: any) {
        this._stepSize = coerceNumberProperty(v);
    }

    onQuickChangeButtonClick(direction: 1 | -1, event?: MouseEvent): void {
        let num = this.inputModel.numberValue;
        if (!num) num = 0;

        if (direction == 1 && num >= this.max) return;
        if (direction == -1 && num <= this.min) return;

        if (event) event.stopPropagation();

        const newValue = num + this.stepSize * direction;
        //round to 9 decimal places to avoid floating point arithmetic errors
        //9 is an arbitrary number that just works well. ¯\_(ツ)_/¯
        const newValuePrecise = roundToPrecision(newValue, 9);

        this.writeValue(newValuePrecise);
        this.quickChangeEvent.next({ direction, value: newValuePrecise });
        this._emitChange();

        this._checkButtonAvailability();
    }
    private _checkButtonAvailability(): void {
        if (!this.canDecrement() || !this.canIncrement()) this.focus();
    }

    canIncrement(): boolean {
        const num = this.inputModel.numberValue;
        return !isDefined(num) || num < this.max;
    }
    canDecrement(): boolean {
        const num = this.inputModel.numberValue;
        return !isDefined(num) || num > this.min;
    }

    //! event handlers
    onInput(newVal: string): void {
        let valueHasChanged = this.inputModel.writeValue(newVal);
        if (!valueHasChanged) return;
        this._emitInput();
    }
    protected _emitInput(): void {
        this.inputEvent.emit(this.inputModel.numberValue);
        this._emitChange();
    }

    //focus, blur, change
    onFocusMaster(event: FocusEvent): void {
        this.onFocus(event);
    }
    onBlurMaster(event: FocusEvent): void {
        this.onBlur(event);
    }
    //change
    onChange(event: Event): void {
        event.stopPropagation();
        this._emitChange();
    }
    protected _emitChange(): void {
        const v = this.inputModel.numberValue;
        this._onChangeRegistered?.(v);
        this.changeEvent.emit(v);
        this.valueChange.emit(this.inputModel.numberValue);
    }

    //smart focus
    onMouseup(event: MouseEvent): void {
        const selection = window.getSelection();
        if (selection && selection.type === 'Range') return;

        this.focus();
    }

    // copy
    onCopy(event: ClipboardEvent): void {
        if (
            this.value &&
            //does the selection cover the entire input
            ((this.textInputEl.nativeElement.selectionStart == 0 &&
                this.textInputEl.nativeElement.selectionEnd ==
                    this.textInputEl.nativeElement.value.length) ||
                //or is zero-wide
                this.textInputEl.nativeElement.selectionStart ==
                    this.textInputEl.nativeElement.selectionEnd)
        ) {
            event.clipboardData?.setData('text/plain', String(this.value));
            event.preventDefault();
        }
    }

    //! helpers
    protected _setInputAttributes() {
        const input = this.textInputEl.nativeElement;
        const attributes: { [key: string]: string } = {
            type: 'text',
            autocorrect: 'off',
            autocapitalize: 'off',
            autocomplete: 'off',
            tabindex: String(this.tabIndex),
            ...this.inputAttrs,
        };

        for (const key of Object.keys(attributes)) {
            input.setAttribute(key, String(attributes[key]));
        }
    }
}
