import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { OneAxisAlignment } from '../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { CaseTransformerType } from '../input-types';
import { ArdHexInputPlaceholderTemplateDirective } from './hex-input.directives';
import { HexInputModel, HexInputModelHost } from './hex-input.model';

@Component({
    selector: 'ard-hex-input',
    templateUrl: './hex-input.component.html',
    styleUrls: ['./hex-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumHexInputComponent),
            multi: true
        }
    ]
})
export class ArdiumHexInputComponent extends _NgModelComponentBase implements ControlValueAccessor, HexInputModelHost, AfterViewInit {

    //! input view
    @ViewChild('textInput', { static: true }) textInputEl!: ElementRef<HTMLInputElement>;
    protected inputModel!: HexInputModel;
    ngAfterViewInit(): void {
        this.inputModel = new HexInputModel(this.textInputEl.nativeElement, this);
        this._setInputAttributes();
        //set the value
        if (this._valueBeforeInit) {
            this.writeValue(this._valueBeforeInit);
            delete this._valueBeforeInit;
        }
    }

    readonly DEFAULTS = {
        clearButtonTitle: 'Clear',
    }

    @Input() inputId?: string;

    //! placeholder
    @Input() placeholder: string = '';

    @ContentChild(ArdHexInputPlaceholderTemplateDirective, { read: TemplateRef })
    placeholderTemplate?: TemplateRef<any>;

    get shouldDisplayPlaceholder(): boolean { return Boolean(this.placeholder) && !this.inputModel.stringValue };

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

    //! settings
    @Input() case: CaseTransformerType = CaseTransformerType.NoChange;

    private _maxDigits: number | undefined = undefined;
    @Input()
    get maxDigits(): number | undefined { return this._maxDigits; }
    set maxDigits(v: any) { this._maxDigits = coerceNumberProperty(v, undefined); }

    private _hideHash: boolean = false;
    @Input()
    get hideHash(): boolean { return this._hideHash; }
    set hideHash(v: any) { this._hideHash = coerceBooleanProperty(v); }
    
    get showHash(): boolean { return !this.hideHash; }

    //! clear button
    private _clearable: boolean = true;
    @Input()
    get clearable(): boolean { return this._clearable; }
    set clearable(v: any) { this._clearable = coerceBooleanProperty(v); }
    
    @Input() clearButtonTitle: string = this.DEFAULTS.clearButtonTitle;
    
    get shouldShowClearButton(): boolean {
        return this._clearable && !this.disabled && Boolean(this.inputModel?.value);
    }
    onClearButtonClick(event: MouseEvent): void {
        event.stopPropagation();
        this.inputModel.clear();
        this._emitChange();
        this._emitInput();
        this.clearEvent.emit();
        this.focus();
    }

    //! other inputs
    @Input() inputAttrs: { [key: string]: any } = {};

    //! control value accessor's write value implementation
    writeValue(v: any) {
        if (!this.inputModel) {
            this._valueBeforeInit = v;
            return;
        }
        this.inputModel.writeValue(v);
    }

    //! value two-way binding
    protected _valueBeforeInit?: string | null = null;
    @Input()
    set value(v: string | null) {
        if (!this.inputModel) {
            this._valueBeforeInit = v;
            return;
        }
        this.writeValue(v);
    }
    get value(): string | null { return this.inputModel?.hashSignValue ?? ''; }
    @Output() valueChange = new EventEmitter<string>();

    //* event emitters
    @Output('input') inputEvent = new EventEmitter<string>();
    @Output('change') changeEvent = new EventEmitter<string>();
    @Output('clear') clearEvent = new EventEmitter<any>();

    //! event handlers
    onInput(newVal: string): void {
        let valueHasChanged = this.inputModel.writeValue(newVal);
        if (!valueHasChanged) return;
        this._emitInput();
    }
    protected _emitInput(): void {
        this.inputEvent.emit(this.inputModel.hashSignValue);
        this._emitChange();
    }

    //change
    onChange(event: Event): void {
        event.stopPropagation();
        this._emitChange();
    }
    protected _emitChange(): void {
        const v = this.inputModel.hashSignValue;
        this._onChangeRegistered?.(v);
        this.changeEvent.emit(v);
        this.valueChange.emit(v);
    }

    //smart focus
    onMouseup(event: MouseEvent): void {
        const selection = window.getSelection();
        if (selection && selection.type === 'Range') return;

        this.focus();
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
            ...this.inputAttrs
        };

        for (const key of Object.keys(attributes)) {
            input.setAttribute(key, String(attributes[key]));
        }
    }
}
