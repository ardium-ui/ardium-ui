import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  forwardRef,
  input,
  Input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import { HexInputModel, HexInputModelHost } from '../hex-input.model';
import { CaseTransformerType } from '../input-types';
import {
  ArdHexInputPlaceholderTemplateDirective,
  ArdHexInputPrefixTemplateDirective,
  ArdHexInputSuffixTemplateDirective,
} from './hex-input.directives';

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
      multi: true,
    },
  ],
})
export class ArdiumHexInputComponent
  extends _NgModelComponentBase
  implements ControlValueAccessor, HexInputModelHost, AfterViewInit
{
  //! input view
  readonly textInputEl = viewChild<ElementRef<HTMLInputElement>>('textInput');

  protected readonly inputModel = new HexInputModel(this);
  protected _wasViewInit = false;
  ngAfterViewInit(): void {
    this._wasViewInit = true;
    this._setInputAttributes();
    //set the value
    if (this._valueBeforeInit) {
      this.writeValue(this._valueBeforeInit);
      delete this._valueBeforeInit;
    }
  }

  readonly DEFAULTS = {
    clearButtonTitle: 'Clear',
  };

  readonly inputId = input<Nullable<string>>();

  //! prefix & suffix
  readonly prefixTemplate = contentChild(ArdHexInputPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdHexInputSuffixTemplateDirective);

  //! placeholder
  readonly placeholder = input<Nullable<string>>();

  readonly placeholderTemplate = contentChild(ArdHexInputPlaceholderTemplateDirective);

  readonly shouldDisplayPlaceholder = computed((): boolean => Boolean(this.placeholder()) && !this.inputModel.stringValue());

  //! appearance
  //all handled in ard-form-field-frame component
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Outlined);
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! settings
  readonly case = input<CaseTransformerType>(CaseTransformerType.NoChange);

  readonly maxDigits = input<Nullable<number>, any>(undefined, { transform: v => coerceNumberProperty(v, undefined) });

  readonly hideHash = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly showHash = computed(() => !this.hideHash());

  //! clear button
  readonly clearable = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly clearButtonTitle = input<string>(this.DEFAULTS.clearButtonTitle);

  readonly shouldShowClearButton = computed<boolean>(
    () => this.clearable() && !this.disabled() && Boolean(this.inputModel?.value())
  );

  onClearButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.inputModel.clear();
    this._emitChange();
    this._emitInput();
    this.clearEvent.emit();
    this.focus();
  }

  //! other inputs
  readonly inputAttrs = input<Record<string, any>>({});

  //! control value accessor's write value implementation
  writeValue(v: any) {
    if (!this._wasViewInit) {
      this._valueBeforeInit = v;
      return;
    }
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
    return this.inputModel?.hashSignValue();
  }
  readonly valueChange = output<string>();

  //! event emitters
  readonly inputEvent = output<string>({ alias: 'input' });
  readonly changeEvent = output<string>({ alias: 'change' });
  readonly clearEvent = output<void>({ alias: 'clear' });

  //! event handlers
  onInput(newVal: string, event: Event): void {
    event.stopPropagation();
    const valueHasChanged = this.inputModel.writeValue(newVal);
    if (!valueHasChanged) return;
    this._emitInput();
  }
  protected _emitInput(): void {
    const v = this.inputModel.hashSignValue();
    this.inputEvent.emit(v);
    this._onChangeRegistered?.(v);
    this.valueChange.emit(v);
  }

  onChange(event: Event): void {
    this._emitChange();
    event.stopPropagation();
  }
  protected _emitChange(): void {
    const v = this.inputModel.hashSignValue();
    this.changeEvent.emit(v);
  }

  override onBlur(event: FocusEvent): void {
    super.onBlur(event);
    this._emitChange();
  }

  //smart focus
  onMouseup(): void {
    const selection = window.getSelection();
    if (selection && selection.type === 'Range') return;

    this.focus();
  }

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
      tabindex: String(this.tabIndex),
      ...this.inputAttrs,
    };

    for (const key of Object.keys(attributes)) {
      input.setAttribute(key, String(attributes[key]));
    }
  }
}
