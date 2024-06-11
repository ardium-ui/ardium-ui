import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceNumberProperty } from '@ardium-ui/devkit';
import { ArdiumStarButtonComponent } from '../star-button/star-button.component';
import { _NgModelComponentBase } from './../../_internal/ngmodel-component';
import { StarColor } from './../star.types';

interface StarInputObject {
  filled: boolean;
  isInValue: boolean;
}

@Component({
  selector: 'ard-star-input',
  templateUrl: './star-input.component.html',
  styleUrls: ['./star-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumStarInputComponent),
      multi: true,
    },
  ],
})
export class ArdiumStarInputComponent extends _NgModelComponentBase implements ControlValueAccessor {
  readonly wrapperClasses = input<string>('');

  //! appearance
  readonly color = input<StarColor>(StarColor.Star);

  readonly ngClasses = computed<string>(() => [this.wrapperClasses(), `ard-color-${this.color()}`].join(' '));

  //! events
  readonly changeEvent = output<number>({ alias: 'change' });
  readonly highlightEvent = output<number>({ alias: 'highlight' });

  readonly value = model<number>(0);

  constructor() {
    super();
    effect(() => {
      const hi = this._highlightedStarIndex();
      if (hi !== null) {
        this.highlightEvent.emit(hi);
      }
    });
    effect(() => {
      this.value(); // let the effect know when to fire
      this._emitChange();
    });
  }

  //! stars
  readonly max = input<number, any>(0, { transform: v => coerceNumberProperty(v, 0) });

  readonly starButtonInstances = viewChildren<ArdiumStarButtonComponent>('starButton');
  private readonly _highlightedStarIndex = signal<number | null>(null);

  readonly starArray = computed<StarInputObject[]>(() => {
    const v = this.value();
    const max = this.max();
    const hi = Math.round(this._highlightedStarIndex() ?? -1);

    const arr = new Array(max);
    for (let i = 0; i < max; i++) {
      if (i < hi) {
        arr[i] = { filled: true, isInValue: true };
        continue;
      }
      if (i < v) {
        arr[i] = { filled: false, isInValue: true };
        continue;
      }
      arr[i] = { filled: false, isInValue: false };
    }
    return arr;
  });

  //! ControlValueAccessor's writeValue
  writeValue(v: number): void {
    this.value.set(v);
  }
  onStarClick(index: number): void {
    this.value.set(index + 1);
  }
  onStarHighlight(index: number): void {
    this._highlightedStarIndex.set(index);
  }
  setDisplayToValue() {
    this._highlightedStarIndex.set(null);
  }
  protected _emitChange(): void {
    this._onChangeRegistered?.(this.value());
    this.changeEvent.emit(this.value());
  }

  //* focus handlers
  private _isFocusEventSuppressed = false;
  private _isBlurEventSuppressed = false;
  private _currentFocusIndex: number | null = null;
  onStarButtonFocus(index: number) {
    this._currentFocusIndex = index;
    if (this._isFocusEventSuppressed) {
      this._isFocusEventSuppressed = false;
      return;
    }
    this.focusEvent.emit();
  }
  onStarButtonBlur(): void {
    this._currentFocusIndex = null;
    if (this._isBlurEventSuppressed) {
      this._isBlurEventSuppressed = false;
      return;
    }
    this.blurEvent.emit();
  }
  focusStarButtonByIndex(index: number): void {
    if (!this.starButtonInstances()) return;
    this.starButtonInstances()[index]!.focus();
  }
  focusNextStarButton(offset: number): void {
    if (!this.starButtonInstances() || this._currentFocusIndex === null) return;

    let nextIndex = this._currentFocusIndex + offset;
    nextIndex = Math.min(nextIndex, this.max() - 1);
    nextIndex = Math.max(nextIndex, 0);

    this.focusStarButtonByIndex(nextIndex);
  }
  private _suppressFocusEvents(): void {
    this._isFocusEventSuppressed = true;
    this._isBlurEventSuppressed = true;
  }

  override focus(): void {
    this.focusStarButtonByIndex(0);
  }
  override blur(): void {
    if (!this.starButtonInstances() || this._currentFocusIndex === null) return;
    this.starButtonInstances()[this._currentFocusIndex]!.blur();
  }

  //! key press handlers
  @HostListener('keydown', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Tab': {
        this._onTabPress();
        return;
      }
      case 'ArrowRight': {
        this._onArrowRightPress(event);
        return;
      }
      case 'ArrowLeft': {
        this._onArrowLeftPress(event);
        return;
      }
      case 'Home': {
        this._onHomePress(event);
        return;
      }
      case 'End': {
        this._onEndPress(event);
        return;
      }
    }
  }
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();
    this._suppressFocusEvents();
    this.focusNextStarButton(+1);
  }
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();
    this._suppressFocusEvents();
    this.focusNextStarButton(-1);
  }
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();
    this._suppressFocusEvents();
    this.focusStarButtonByIndex(0);
  }
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();
    this._suppressFocusEvents();
    this._onTabPress();
  }
  private _onTabPress(): void {
    this.focusStarButtonByIndex(this.max() - 1);
  }
}
