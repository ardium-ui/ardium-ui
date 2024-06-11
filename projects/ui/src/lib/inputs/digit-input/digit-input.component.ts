import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { DigitInputModel } from './digit-input.model';
import { DigitInputConfig, DigitInputShape } from './digit-input.types';
import { DigitInputConfigData, DigitInputModelHost } from './digit-input.utils';

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
  ],
})
export class ArdiumDigitInputComponent
  extends _NgModelComponentBase
  implements ControlValueAccessor, DigitInputModelHost, AfterContentInit
{
  private readonly model = new DigitInputModel(this);

  //! appearance
  @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
  @Input() variant: FormElementVariant = FormElementVariant.Rounded;
  @Input() shape: DigitInputShape = DigitInputShape.Square;

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
      `ard-shape-${this.shape}`,
      this.compact ? 'ard-compact' : '',
    ].join(' ');
  }

  //! model access points
  @Input()
  set config(v: DigitInputConfig) {
    this.model.setConfig(v);
  }
  configArrayData: DigitInputConfigData[] = [];

  get isConfigDefined(): boolean {
    return this.model.isConfigDefined;
  }

  isInputEmpty(index: number): boolean {
    return !this.model.isDefinedAtIndex(index);
  }

  //! control value accessor's write value implementation
  writeValue(v: any): void {
    this._writeValue(v);
  }
  private _writeValue(v: any): boolean {
    return this.model.writeValue(v);
  }

  //! value two-way binding
  private _outputAsString = false;
  @Input()
  get outputAsString(): boolean {
    return this._outputAsString;
  }
  set outputAsString(v: any) {
    this._outputAsString = coerceBooleanProperty(v);
  }

  @Input()
  set value(v: string | (string | null)[] | null) {
    this.writeValue(v);
  }
  get value(): (string | null)[] | null {
    return this.model.value;
  }
  @Output() valueChange = new EventEmitter<string | (string | null)[] | null>();

  get stringValue(): string {
    return this.model.stringValue;
  }

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

    const maxLength = this.inputs.length - index;
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
  }
  private _updateSingleInputValue(value: string, index: number): void {
    const valueChanged = this.model.validateInputAndSetValue(value, index);
    if (!valueChanged || !valueChanged[0]) return;

    if (valueChanged[1]) {
      this.focusByIndex(index + 1);
    }
    this._emitInput();
  }
  focusByIndex(index: number): boolean;
  focusByIndex(index: number, tryFocusingNext: boolean, direction: 1 | -1): boolean;
  focusByIndex(index: number, tryFocusingNext?: boolean, direction?: 1 | -1): boolean {
    if (index < 0 || index >= this.inputs.length) return false;
    const nextEl = this.inputs.get(index)?.nativeElement;
    if (!nextEl) return false;

    nextEl.focus();
    if (tryFocusingNext && direction && document.activeElement !== nextEl) {
      return this.focusByIndex(index + direction);
    }
    return document.activeElement === nextEl;
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
        this.focusByIndex(index - 1, true, -1);
        break;
      case 'ArrowRight':
        this.focusByIndex(index + 1, true, +1);
        break;
      case 'Home':
        this.focusByIndex(0, true, 1);
        break;
      case 'End':
        this.focusByIndex(this.inputs.length - 1, true, -1);
        break;
      case 'Backspace':
      case 'Delete':
        this._updateSingleInputValue('', index);
        this.focusByIndex(index - 1, true, -1);
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
