import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FormFieldComponentBase } from '../../_internal/form-field-component';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { ARD_DIGIT_INPUT_DEFAULTS, ArdDigitInputDefaults } from './digit-input.defaults';
import { DigitInputModel } from './digit-input.model';
import { DigitInputConfig, DigitInputShape } from './digit-input.types';
import { DigitInputModelHost } from './digit-input.utils';

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
      multi: true,
    },
    {
      provide: _FormFieldComponentBase,
      useExisting: ArdiumDigitInputComponent,
    },
  ],
})
export class ArdiumDigitInputComponent
  extends _FormFieldComponentBase
  implements ControlValueAccessor, DigitInputModelHost, OnInit, AfterViewInit
{
  protected override readonly _DEFAULTS!: ArdDigitInputDefaults;
  constructor(@Inject(ARD_DIGIT_INPUT_DEFAULTS) defaults: ArdDigitInputDefaults) {
    super(defaults);
  }

  //! inputs ref
  readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('input');

  //! data model
  private readonly model = new DigitInputModel(this);

  //! appearance
  readonly appearance = input<FormElementAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<FormElementVariant>(this._DEFAULTS.variant);
  readonly shape = input<DigitInputShape>(this._DEFAULTS.shape);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed((): string =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-shape-${this.shape()}`,
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );

  //! model access points
  readonly config = input.required<void, DigitInputConfig>({
    transform: v => this.model.setConfig(v),
  });
  readonly configArrayData = this.model.configArrayData;

  private _oldConfigArrayDataLength = -1;
  readonly configArrayDataEffect = effect(() => {
    if (this.configArrayData().length === this._oldConfigArrayDataLength) return;

    this._oldConfigArrayDataLength = this.configArrayData().length;
    this._emitChange();
  });

  override ngOnInit(): void {
    super.ngOnInit();
    this._oldConfigArrayDataLength = this.configArrayData().length;
  }

  isInputEmpty(index: number): boolean {
    return !this.model.isDefinedAtIndex(index);
  }

  //! control value accessor's write value implementation
  private _valueBeforeViewInit?: any;
  writeValue(v: any): void {
    if (!this._wasViewInit) {
      this._valueBeforeViewInit = v;
      return;
    }
    this._writeValue(v);
  }
  private _writeValue(v: any): boolean {
    return this.model.writeValue(v);
  }

  private _wasViewInit = false;
  ngAfterViewInit(): void {
    this._wasViewInit = true;

    if (this._valueBeforeViewInit) {
      this._writeValue(this._valueBeforeViewInit);
    }
  }

  //! value two-way binding
  readonly outputAsString = input<boolean, any>(this._DEFAULTS.outputAsString, { transform: v => coerceBooleanProperty(v) });

  readonly outputControlValueAccessorOnFinish = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  @Input()
  set value(v: string | (string | null)[] | null) {
    this.writeValue(v);
  }
  readonly valueChange = output<string | (string | null)[] | null>();

  readonly stringValue = this.model.stringValue;

  readonly emittableValue = computed((): string | (string | null)[] | null => {
    if (this.outputAsString()) return this.model.stringValue();
    return this.model.value();
  });

  //! event emitters
  readonly finishedValue = output<string | (string | null)[] | null>();

  readonly focusIndexEvent = output<number>({ alias: 'focusIndex' });
  readonly blurIndexEvent = output<number>({ alias: 'blurIndex' });

  //! event handlers
  onPaste(event: ClipboardEvent, index: number): void {
    const value = event.clipboardData?.getData('text');
    event.stopPropagation();
    event.preventDefault();
    if (!value) return;

    const maxLength = this.inputs().length - index;
    value
      .slice(0, maxLength)
      .split('')
      .forEach((char, i) => {
        this.model.validateInputAndSetValue(char, index + i);
      });
    this.focusByIndex(index - 1 + Math.min(value.length, maxLength));
  }
  onInput(event: Event, index: number): void {
    this._updateSingleInputValue((event.target as HTMLInputElement).value, index);
    this.focusByIndex(index + 1);
  }
  private _updateSingleInputValue(value: string, index: number): void {
    const changeResult = this.model.validateInputAndSetValue(value, index);
    if (!changeResult?.wasChanged) return;

    this._emitChange();

    if (this.model.isValueFull()) {
      this.blur();
    }
  }
  focusByIndex(index: number): boolean;
  focusByIndex(index: number, tryFocusingNext: boolean, direction: 1 | -1): boolean;
  focusByIndex(index: number, tryFocusingNext?: boolean, direction?: 1 | -1): boolean {
    if (index < 0 || index >= this.inputs().length) return false;
    const nextEl = this.inputs()[index]?.nativeElement;
    if (!nextEl) return false;

    nextEl.focus();
    if (tryFocusingNext && direction && document.activeElement !== nextEl) {
      return this.focusByIndex(index + direction);
    }
    return document.activeElement === nextEl;
  }
  //focus, blur, change
  onFocusMaster(event: FocusEvent, index: number): void {
    this.focusIndexEvent.emit(index);
    this.onFocus(event);
  }
  onBlurMaster(event: FocusEvent, index: number): void {
    this.blurIndexEvent.emit(index);
    this.onBlur(event);
  }
  protected _emitChange(): void {
    const v = this.emittableValue();
    if (!this.outputControlValueAccessorOnFinish() || this.model.isValueFull()) this._onChangeRegistered?.(v);
    this.valueChange.emit(v);
    if (this.model.isValueFull()) {
      this.finishedValue.emit(v);
    }
  }
  onKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.focusByIndex(index - 1, true, -1);
        return;
      case 'ArrowRight':
        this.focusByIndex(index + 1, true, +1);
        return;
      case 'Home':
        this.focusByIndex(0, true, 1);
        return;
      case 'End':
        this.focusByIndex(this.inputs.length - 1, true, -1);
        return;
      case 'Backspace':
      case 'Delete':
        this._updateSingleInputValue('', index);
        this.focusByIndex(index - 1, true, -1);
        event.preventDefault();
        return;
    }
  }
}
