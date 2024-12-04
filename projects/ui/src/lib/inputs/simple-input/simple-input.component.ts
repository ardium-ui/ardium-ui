import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  forwardRef,
  Inject,
  input,
  Input,
  output,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { _NgModelComponentBaseWithDefaults } from '../../_internal/ngmodel-component';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import { SimpleOneAxisAlignment } from './../../types/alignment.types';
import { SimpleInputModel, SimpleInputModelHost } from './../input-utils';
import { ARD_SIMPLE_INPUT_DEFAULTS, ArdSimpleInputDefaults } from './simple-input.defaults';
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
export class ArdiumSimpleInputComponent
  extends _NgModelComponentBaseWithDefaults
  implements SimpleInputModelHost, ControlValueAccessor, AfterViewInit
{
  protected override readonly _DEFAULTS!: ArdSimpleInputDefaults;
  constructor(@Inject(ARD_SIMPLE_INPUT_DEFAULTS) defaults: ArdSimpleInputDefaults) {
    super(defaults);
  }

  //! input view
  readonly textInputEl = viewChild<ElementRef<HTMLInputElement>>('textInput');

  protected readonly inputModel = new SimpleInputModel(this);
  private _wasViewInit = false;
  ngAfterViewInit(): void {
    this._wasViewInit = true;
    this._setInputAttributes();
    //set the value
    if (this._valueBeforeInit) {
      this.writeValue(this._valueBeforeInit);
      delete this._valueBeforeInit;
    }
  }

  readonly placeholder = input<string>(this._DEFAULTS.placeholder);
  readonly inputId = input<Nullable<string>>(undefined);
  readonly clearButtonTitle = input<string>(this._DEFAULTS.clearButtonTitle);

  //! prefix & suffix
  readonly prefixTemplate = contentChild(ArdSimpleInputPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdSimpleInputSuffixTemplateDirective);

  //! placeholder
  readonly placeholderTemplate = contentChild(ArdSimpleInputPlaceholderTemplateDirective);

  readonly shouldDisplayPlaceholder = computed<boolean>(() => Boolean(this.placeholder()) && !this.inputModel.value());

  //! appearance
  readonly appearance = input<FormElementAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<FormElementVariant>(this._DEFAULTS.variant);
  readonly alignText = input<SimpleOneAxisAlignment>(this._DEFAULTS.alignText);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed((): string =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-text-align-${this.alignText()}`,
      this.compact() ? 'ard-compact' : '',
      this.clearable() ? 'ard-clearable' : '',
    ].join(' ')
  );

  //! other inputs
  readonly inputAttrs = input<Record<string, any>>(this._DEFAULTS.inputAttrs);

  //! number attribute setters/getters
  readonly maxLength = input<Nullable<number>, any>(this._DEFAULTS.maxLength, {
    transform: v => coerceNumberProperty(v, this._DEFAULTS.maxLength),
  });

  //! no-value attribute setters/getters
  readonly clearable = input<boolean, any>(this._DEFAULTS.clearable, { transform: v => coerceBooleanProperty(v) });

  //! control value accessor's write value implementation
  writeValue(v: any) {
    this.inputModel.writeValue(v);
  }
  //! value two-way binding
  protected _valueBeforeInit?: string | null = null;
  @Input()
  set value(v: string | null) {
    if (!this._wasViewInit) {
      this._valueBeforeInit = v;
      return;
    }
    this.writeValue(v);
  }
  get value(): string | null {
    return this.inputModel.value();
  }
  readonly valueChange = output<string | null>();

  //! event emitters
  readonly inputEvent = output<string | null>({ alias: 'input' });
  readonly changeEvent = output<string | null>({ alias: 'change' });
  readonly clearEvent = output<MouseEvent>({ alias: 'clear' });

  //! event handlers
  onInput(newVal: string): void {
    const valueHasChanged = this.inputModel.writeValue(newVal);
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
    this.changeEvent.emit(this.inputModel.value());
  }
  // clear button
  readonly shouldShowClearButton = computed<boolean>(
    () => this.clearable() && !this.disabled() && Boolean(this.inputModel.value())
  );
  onClearButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.inputModel.clear();
    this._emitChange();
    this._emitInput();
    this.clearEvent.emit(event);
    this.focus();
  }

  //! copy event
  onCopy(event: ClipboardEvent): void {
    if (
      this.value &&
      //does the selection cover the entire input
      ((this.textInputEl()?.nativeElement.selectionStart === 0 &&
        this.textInputEl()?.nativeElement.selectionEnd === this.textInputEl()?.nativeElement.value.length) ||
        //or is zero-wide
        this.textInputEl()?.nativeElement.selectionStart === this.textInputEl()?.nativeElement.selectionEnd)
    ) {
      event.clipboardData?.setData('text/plain', this.value);
      event.preventDefault();
    }
  }
  //! helpers
  protected _setInputAttributes() {
    const input = this.textInputEl()!.nativeElement;
    const attributes: Record<string, string> = {
      type: 'text',
      autocorrect: 'off',
      autocapitalize: 'off',
      autocomplete: 'off',
      tabindex: String(this.tabIndex()),
      ...this.inputAttrs(),
    };

    for (const key of Object.keys(attributes)) {
      input.setAttribute(key, String(attributes[key]));
    }
  }
}
