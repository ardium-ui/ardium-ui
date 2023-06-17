import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, Input, ContentChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { HexInputModel, HexInputModelHost } from '../hex-input.model';
import { ArdColorInputPlaceholderTemplateDirective, ArdColorInputPrefixTemplateDirective, ArdColorInputSuffixTemplateDirective } from './color-input.directives';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { CaseTransformerType } from '../input-types';
import { isAnyString } from 'simple-bool';
import { isNull } from 'simple-bool';

@Component({
    selector: 'ard-color-input',
    templateUrl: './color-input.component.html',
    styleUrls: ['./color-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumColorInputComponent),
            multi: true
        }
    ]
})
export class ArdiumColorInputComponent extends _NgModelComponentBase implements ControlValueAccessor, AfterViewInit {

    //! input view
    @ViewChild('textInput') protected textInputEl!: ElementRef<HTMLInputElement>;
    ngAfterViewInit(): void {
        this._setInputAttributes();
    }

    readonly DEFAULTS = {
        clearButtonTitle: 'Clear',
    }

    @Input() inputId?: string;

    //! prefix & suffix
    @ContentChild(ArdColorInputPrefixTemplateDirective, { read: TemplateRef }) prefixTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorInputSuffixTemplateDirective, { read: TemplateRef }) suffixTemplate?: TemplateRef<any>;

    //! placeholder
    @Input() placeholder: string = '';

    @ContentChild(ArdColorInputPlaceholderTemplateDirective, { read: TemplateRef })
    placeholderTemplate?: TemplateRef<any>;

    get shouldDisplayPlaceholder(): boolean { return Boolean(this.placeholder) && !this.value };

    //! appearance
    //all handled in ard-form-field-frame component
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    //! settings
    @Input() case: CaseTransformerType = CaseTransformerType.NoChange;

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
        if (!isAnyString(v) && !isNull(v)) {
            //warn when using non-string/non-null value
            console.warn(new Error(`Trying to set ard-color-input's value to type ${typeof v}, expected string or null.`));
            this._value = null;
            return;
        }
        if (!v) {
            this._value = null;
            return;
        }
        //normalize the value
        v = v ?? '';
        if (typeof v == 'string')
            v = v.replace('#', '');
        
        if (!v.match(/^([0-9a-f]{3}){1,2}$/i) && !v.match(/^([0-9a-f]{4}){1,2}$/i)) {
            //warn when using invalid value string
            console.warn(new Error(`Invalid ard-color-input value "${v}". Expected a valid hex color code.`));
            this._value = null;
            return;
        }
        this._value = v;
    }

    //! value two-way binding
    protected _value: string | null = null;
    @Input()
    set value(v: string | null) {
        this.writeValue(v);
    }
    get value(): string | null { return this._value; }
    @Output() valueChange = new EventEmitter<string>();

    //* event emitters
    @Output('input') inputEvent = new EventEmitter<string>();
    @Output('change') changeEvent = new EventEmitter<string>();
    @Output('clear') clearEvent = new EventEmitter<any>();

    //! event handlers
    onInput(newVal: string): void {
        // let valueHasChanged = this.inputModel.writeValue(newVal);
        // if (!valueHasChanged) return;
        this._emitInput();
    }
    protected _emitInput(): void {
        if (!this.value) return;

        this.inputEvent.emit(this.value);
        this._emitChange();
    }

    //change
    onChange(event: Event): void {
        event.stopPropagation();
        this._emitChange();
    }
    protected _emitChange(): void {
        const v = this.value;
        if (!v) return;
        
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

    onCopy(event: ClipboardEvent): void {
        const v = this.value;
        if (!v) return;

        event.clipboardData?.setData("text/plain", v);
        event.preventDefault();
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
