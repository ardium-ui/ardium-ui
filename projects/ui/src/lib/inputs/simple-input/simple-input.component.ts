import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { SimpleOneAxisAlignment } from './../../types/alignment.types';
import { SimpleInputModel, SimpleInputModelHost } from './../input-utils';
import {
  ArdSimpleInputPlaceholderTemplateDirective,
  ArdSimpleInputPrefixTemplateDirective,
  ArdSimpleInputSuffixTemplateDirective,
} from './simple-input.directives';

@Component({
  selector: 'ard-simple-input',
  templateUrl: './simple-input.component.html',
  styleUrls: ['./simple-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumSimpleInputComponent),
      multi: true,
    },
  ],
})
export class ArdiumSimpleInputComponent extends _NgModelComponentBase implements SimpleInputModelHost, ControlValueAccessor, OnInit {
  readonly DEFAULTS = {
    clearButtonTitle: 'Clear',
  };
  //! input view
  @ViewChild('textInput', { static: true })
  textInputEl!: ElementRef<HTMLInputElement>;
  protected inputModel!: SimpleInputModel;
  ngOnInit(): void {
    this.inputModel = new SimpleInputModel(this.textInputEl.nativeElement, this);
    this._setInputAttributes();
    //set the value
    if (this._valueBeforeInit) {
      this.writeValue(this._valueBeforeInit);
      delete this._valueBeforeInit;
    }
  }

  @Input() placeholder: string = '';
  @Input() inputId?: string;
  @Input() clearButtonTitle: string = this.DEFAULTS.clearButtonTitle;

  //! prefix & suffix
  @ContentChild(ArdSimpleInputPrefixTemplateDirective, { read: TemplateRef })
  prefixTemplate?: TemplateRef<any>;
  @ContentChild(ArdSimpleInputSuffixTemplateDirective, { read: TemplateRef })
  suffixTemplate?: TemplateRef<any>;

  //! placeholder
  @ContentChild(ArdSimpleInputPlaceholderTemplateDirective, {
    read: TemplateRef,
  })
  placeholderTemplate?: TemplateRef<any>;

  get shouldDisplayPlaceholder(): boolean {
    return Boolean(this.placeholder) && !this.value;
  }

  //! appearance
  @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
  @Input() variant: FormElementVariant = FormElementVariant.Rounded;
  @Input() alignText: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Left;

  private _compact: boolean = false;
  @Input()
  get compact(): boolean {
    return this._compact;
  }
  set compact(v: any) {
    this._compact = coerceBooleanProperty(v);
  }

  get ngClasses(): string {
    return [`ard-appearance-${this.appearance}`, `ard-variant-${this.variant}`, `ard-text-align-${this.alignText}`, this.compact ? 'ard-compact' : ''].join(
      ' '
    );
  }

  //! other inputs
  @Input() inputAttrs: { [key: string]: any } = {};

  //! number attribute setters/getters
  protected _maxLength?: number;
  @Input()
  get maxLength(): number | undefined {
    return this._maxLength;
  }
  set maxLength(v: any) {
    this._maxLength = coerceNumberProperty(v);
  }

  //! no-value attribute setters/getters
  protected _clearable: boolean = true;
  @Input()
  @HostBinding('class.ard-clearable')
  get clearable(): boolean {
    return this._clearable;
  }
  set clearable(v: any) {
    this._clearable = coerceBooleanProperty(v);
  }

  //! control value accessor's write value implementation
  writeValue(v: any) {
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
  get value(): string | null {
    return this.inputModel.value;
  }
  @Output() valueChange = new EventEmitter<string | null>();

  //! event emitters
  @Output('input') inputEvent = new EventEmitter<string | null>();
  @Output('change') changeEvent = new EventEmitter<string | null>();
  @Output('clear') clearEvent = new EventEmitter<MouseEvent>();

  //! event handlers
  onInput(newVal: string): void {
    let valueHasChanged = this.inputModel.writeValue(newVal);
    if (!valueHasChanged) return;
    this._emitInput();
  }
  protected _emitInput(): void {
    this._onChangeRegistered?.(this.value);
    this.inputEvent.emit(this.value);
    this.valueChange.emit(this.value);
  }
  //focus, blur, change
  onFocusMaster(event: FocusEvent): void {
    this.onFocus(event);
  }
  onBlurMaster(event: FocusEvent): void {
    this.onBlur(event);
  }
  onChange(event: Event): void {
    event.stopPropagation();
    this._emitChange();
  }
  protected _emitChange(): void {
    this.changeEvent.emit(this.inputModel.value);
  }
  // clear button
  get shouldShowClearButton(): boolean {
    return this._clearable && !this.disabled && Boolean(this.inputModel.value);
  }
  onClearButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.inputModel.clear();
    this._emitChange();
    this._emitInput();
    this.clearEvent.emit(event);
    this.focus();
  }

  // copy
  onCopy(event: ClipboardEvent): void {
    if (
      this.value &&
      //does the selection cover the entire input
      ((this.textInputEl.nativeElement.selectionStart == 0 && this.textInputEl.nativeElement.selectionEnd == this.textInputEl.nativeElement.value.length) ||
        //or is zero-wide
        this.textInputEl.nativeElement.selectionStart == this.textInputEl.nativeElement.selectionEnd)
    ) {
      event.clipboardData?.setData('text/plain', this.value);
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
