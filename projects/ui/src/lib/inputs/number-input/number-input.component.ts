import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BooleanLike, coerceBooleanProperty, coerceNumberProperty, NumberLike } from '@ardium-ui/devkit';
import { roundToPrecision } from 'more-rounding';
import { isDefined } from 'simple-bool';
import { _FormFieldComponentBase } from '../../_internal/form-field-component';
import { ButtonAppearance, ButtonVariant } from '../../buttons/general-button.types';
import { ARD_FORM_FIELD_CONTROL } from '../../form-field/form-field-child.token';
import { OneAxisAlignment } from '../../types/alignment.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import { NumberInputModel, NumberInputModelHost } from '../input-utils';
import { ARD_NUMBER_INPUT_DEFAULTS, ArdNumberInputDefaults } from './number-input.defaults';
import { ArdNumberInputPlaceholderTemplateDirective } from './number-input.directives';

@Component({
  standalone: false,
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
    {
      provide: ARD_FORM_FIELD_CONTROL,
      useExisting: ArdiumNumberInputComponent,
    },
  ],
})
export class ArdiumNumberInputComponent
  extends _FormFieldComponentBase
  implements ControlValueAccessor, NumberInputModelHost, AfterViewInit
{
  protected override readonly _DEFAULTS!: ArdNumberInputDefaults;
  constructor(@Inject(ARD_NUMBER_INPUT_DEFAULTS) defaults: ArdNumberInputDefaults) {
    super(defaults);

    effect(() => {
      const v = this.inputModel.numberValue();
      this.valueChange.emit(v);
      this._onChangeRegistered?.(v);
    });
  }

  //! input view
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('textInput');

  protected readonly inputModel = new NumberInputModel(this);
  private _wasViewInit = false;
  ngAfterViewInit(): void {
    this._setInputAttributes();
    this._wasViewInit = true;
    //set the value
    if (this._valueBeforeInit) {
      this.writeValue(this._valueBeforeInit);
      delete this._valueBeforeInit;
    }
  }

  readonly inputId = input<Nullable<string>>();

  //! placeholder
  readonly placeholder = input<Nullable<string>>();

  readonly placeholderTemplate = contentChild(ArdNumberInputPlaceholderTemplateDirective);

  readonly shouldDisplayPlaceholder = computed<boolean>(() => !!this.placeholder() && !this.inputModel.stringValue());

  //! appearance
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Outlined);
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);
  readonly alignText = input<OneAxisAlignment>(OneAxisAlignment.Middle);

  readonly compact = input<boolean, BooleanLike>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed((): string => {
    return [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-text-align-${this.alignText()}`,
      `ard-quick-change-${!this.noButtons()}`,
      this.compact() ? 'ard-compact' : '',
    ].join(' ');
  });

  readonly buttonVariant = computed((): ButtonVariant => {
    if (this.variant() === FormElementVariant.Rounded) return ButtonVariant.Rounded;
    if (this.variant() === FormElementVariant.Pill) return ButtonVariant.Pill;
    if (this.variant() === FormElementVariant.Sharp) return ButtonVariant.Sharp;
    return ButtonVariant.Rounded;
  });
  readonly buttonAppearance = computed<ButtonAppearance>(() => {
    if (this.appearance() === FormElementAppearance.Outlined && this.variant() !== FormElementVariant.Pill) {
      return ButtonAppearance.Outlined;
    }
    return ButtonAppearance.Transparent;
  });

  //! other inputs
  readonly inputAttrs = input<Record<string, any>>({});

  //! control value accessor's write value implementation
  writeValue(v: any) {
    this.inputModel.writeValue(v);
  }

  //! value two-way binding
  protected _valueBeforeInit?: string | null = '0';
  @Input()
  set value(v: string | number | null) {
    if (typeof v === 'number') v = v.toString();
    if (!this._wasViewInit) {
      this._valueBeforeInit = v;
      return;
    }
    this.writeValue(v);
  }
  readonly valueChange = output<number | null>();

  //! event emitters
  readonly inputEvent = output<number | null>({ alias: 'input' });
  readonly changeEvent = output<number | null>({ alias: 'change' });
  readonly clearEvent = output<MouseEvent>({ alias: 'clear' });
  readonly quickChangeEvent = output<{
    readonly direction: 1 | -1;
    readonly value: number;
  }>({ alias: 'quickChange' });

  //! min/max and number type
  readonly min = input<number, NumberLike>(0, { transform: v => coerceNumberProperty(v, 0) });
  readonly max = input<number, NumberLike>(999999, { transform: v => coerceNumberProperty(v, 999999) });

  readonly allowFloat = input<boolean, BooleanLike>(false, { transform: v => coerceBooleanProperty(v) });

  //! incerement/decrement buttons
  readonly noButtons = input<boolean, BooleanLike>(false, { transform: v => coerceBooleanProperty(v) });

  readonly keepFocusOnQuickChangeButton = input<boolean, BooleanLike>(true, { transform: v => coerceBooleanProperty(v) });

  readonly stepSize = input<number, NumberLike>(1, {
    transform: v => {
      const newValue = coerceNumberProperty(v, 1);
      if (newValue === 0) throw new Error(`ARD-FT0071a: Cannot set <ard-number-input>'s [stepSize] to 0.`);
      if (newValue < 0)
        throw new Error(`ARD-FT0071b: Cannot set <ard-number-input>'s [stepSize] to a negative value, got "${newValue}".`);
      return newValue;
    },
  });

  onQuickChangeButtonClick(direction: 1 | -1, event?: MouseEvent): void {
    let num = this.inputModel.numberValue();
    if (!num) num = 0;

    if (direction === 1 && num >= this.max()) return;
    if (direction === -1 && num <= this.min()) return;

    if (event) event.stopPropagation();

    const newValue = num + this.stepSize() * direction;
    //round to 9 decimal places to avoid floating point arithmetic errors
    //9 is an arbitrary number that just works well. ¯\_(ツ)_/¯
    const newValuePrecise = roundToPrecision(newValue, 9);

    this.writeValue(newValuePrecise);
    this.quickChangeEvent.emit({ direction, value: newValuePrecise });
    this._emitChange();
    this._emitTouched();

    this._focusInputIfCantQuickChange();
  }
  private _focusInputIfCantQuickChange(): void {
    if (this.keepFocusOnQuickChangeButton()) return;
    if (!this.canDecrement() || !this.canIncrement()) this.focus();
  }
  onQuickChangeButtonMouseup(event: MouseEvent): void {
    // prevent the event from reaching the parent element
    if (this.keepFocusOnQuickChangeButton()) {
      event.stopPropagation();
    }
  }

  canIncrement(): boolean {
    const num = this.inputModel.numberValue();
    return !isDefined(num) || num < this.max();
  }
  canDecrement(): boolean {
    const num = this.inputModel.numberValue();
    return !isDefined(num) || num > this.min();
  }

  //! event handlers
  onInput(newVal: string): void {
    const valueHasChanged = this.inputModel.writeValue(newVal);
    if (!valueHasChanged) return;
    this._emitInput();
  }
  protected _emitInput(): void {
    this.inputEvent.emit(this.inputModel.numberValue());
    this._emitChange();
  }

  //focus, blur, change
  onFocusMaster(event: FocusEvent): void {
    this.onFocus(event);
  }
  onBlurMaster(event: FocusEvent): void {
    this.onBlur(event);
  }
  private _emitTouched() {
    this.wasTouched.set(true);
    this._onTouchedRegistered?.();
  }
  //change
  onChange(event: Event): void {
    event.stopPropagation();
    this._emitChange();
  }
  protected _emitChange(): void {
    const v = this.inputModel.numberValue();
    this.changeEvent.emit(v);
  }

  //smart focus
  onMouseup(): void {
    const selection = window.getSelection();
    if (selection && selection.type === 'Range') return;

    this.focus();
  }

  // copy
  onCopy(event: ClipboardEvent): void {
    if (
      this.value &&
      //does the selection cover the entire input
      ((this.inputEl()?.nativeElement.selectionStart === 0 &&
        this.inputEl()?.nativeElement.selectionEnd === this.inputEl()?.nativeElement.value.length) ||
        //or is zero-wide
        this.inputEl()?.nativeElement.selectionStart === this.inputEl()?.nativeElement.selectionEnd)
    ) {
      event.clipboardData?.setData('text/plain', String(this.value));
      event.preventDefault();
    }
  }

  //! helpers
  protected _setInputAttributes() {
    const input = this.inputEl()!.nativeElement;
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
