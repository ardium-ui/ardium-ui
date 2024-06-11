import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isAnyString, isDefined } from 'simple-bool';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import {
  ArdPasswordInputPlaceholderTemplateDirective,
  ArdPasswordInputPrefixTemplateDirective,
  ArdPasswordInputRevealButtonTemplateDirective,
  ArdPasswordInputSuffixTemplateDirective,
} from './password-input.directives';
import { PasswordInputRevealButtonContext } from './password-input.types';

@Component({
  selector: 'ard-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumPasswordInputComponent),
      multi: true,
    },
  ],
})
export class ArdiumPasswordInputComponent extends _NgModelComponentBase implements ControlValueAccessor, OnInit {
  //! input view
  @ViewChild('textInput', { static: true })
  textInputEl!: ElementRef<HTMLInputElement>;
  ngOnInit(): void {
    this._setInputAttributes();
  }

  @Input() placeholder = '';
  @Input() inputId?: string;

  //! prefix & suffix
  @ContentChild(ArdPasswordInputPrefixTemplateDirective, {
    read: TemplateRef,
  })
  prefixTemplate?: TemplateRef<any>;
  @ContentChild(ArdPasswordInputSuffixTemplateDirective, {
    read: TemplateRef,
  })
  suffixTemplate?: TemplateRef<any>;

  //! placeholder
  @ContentChild(ArdPasswordInputPlaceholderTemplateDirective, {
    read: TemplateRef,
  })
  placeholderTemplate?: TemplateRef<any>;

  get shouldDisplayPlaceholder(): boolean {
    return Boolean(this.placeholder) && !this.value;
  }

  //! revealing
  private _revealable = true;
  @Input()
  get revealable(): boolean {
    return this._revealable;
  }
  set revealable(v: any) {
    this._revealable = coerceBooleanProperty(v);
  }

  private _revealed = false;
  @Input()
  get revealed(): boolean {
    return this._revealed;
  }
  set revealed(v: any) {
    this._revealed = coerceBooleanProperty(v);
  }

  @Output() revealedChange = new EventEmitter<boolean>();

  toggleReveal(v?: boolean): void {
    const oldState = this.revealed;
    this.revealed = v ?? !this.revealed;

    if (oldState !== this.revealed) {
      this.revealedChange.emit(this.revealed);
    }
  }

  @ContentChild(ArdPasswordInputRevealButtonTemplateDirective, {
    read: TemplateRef,
  })
  revealTemplate?: TemplateRef<any>;

  getRevealButtonContext(): PasswordInputRevealButtonContext {
    return {
      $implicit: this.revealed,
    };
  }

  //! appearance
  @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
  @Input() variant: FormElementVariant = FormElementVariant.Rounded;

  private _compact = false;
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
      this.compact ? 'ard-compact' : '',
      this.revealable ? 'ard-revealable' : '',
    ].join(' ');
  }

  //! other inputs
  @Input() inputAttrs: Record<string, any> = {};

  //! number attribute setters/getters
  protected _maxLength?: number;
  @Input()
  get maxLength(): number | undefined {
    return this._maxLength;
  }
  set maxLength(v: any) {
    this._maxLength = coerceNumberProperty(v);
  }

  //! control value accessor's write value implementation
  writeValue(v: any) {
    if (!isAnyString(v) && isDefined(v)) {
      console.error(new Error(`Error using <ard-password-input>: Unexpected value type ${typeof v}.`));
      return;
    }
    this._writeValue(v);
  }
  protected _writeValue(v: string | null | undefined): boolean {
    const oldVal = this.value;
    this._value = v;
    return oldVal !== v;
  }
  //! value two-way binding
  protected _value?: string | null = null;
  @Input()
  set value(v: string | null) {
    this.writeValue(v);
  }
  get value(): string | null {
    return this._value ?? null;
  }
  @Output() valueChange = new EventEmitter<string | null>();

  //! event emitters
  @Output('input') inputEvent = new EventEmitter<string | null>();
  @Output('change') changeEvent = new EventEmitter<string | null>();

  //! event handlers
  onInput(newVal: string): void {
    const valueHasChanged = this._writeValue(newVal);
    if (!valueHasChanged) return;
    this._emitInput();
  }
  protected _emitInput(): void {
    const v = this.value;
    this._onChangeRegistered?.(v);
    this.inputEvent.emit(v);
    this.valueChange.emit(v);
  }
  //focus, blur, change
  onChange(event: Event): void {
    event.stopPropagation();
    this._emitChange();
  }
  protected _emitChange(): void {
    this.changeEvent.emit(this.value);
  }

  // copy
  onCopy(event: ClipboardEvent): void {
    if (
      this.value &&
      //does the selection cover the entire input
      ((this.textInputEl.nativeElement.selectionStart === 0 &&
        this.textInputEl.nativeElement.selectionEnd === this.textInputEl.nativeElement.value.length) ||
        //or is zero-wide
        this.textInputEl.nativeElement.selectionStart === this.textInputEl.nativeElement.selectionEnd)
    ) {
      event.clipboardData?.setData('text/plain', this.value);
      event.preventDefault();
    }
  }
  //! helpers
  protected _setInputAttributes() {
    const input = this.textInputEl.nativeElement;
    const attributes: Record<string, string> = {
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
