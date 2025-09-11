import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    Inject,
    ViewEncapsulation,
    computed,
    contentChild,
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
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { ArdiumStarButtonComponent } from '../star-button/star-button.component';
import { StarColor } from '../star.types';
import { ARD_RATING_INPUT_DEFAULTS, ArdRatingInputDefaults } from './rating-input.defaults';
import { ArdRatingInputStarButtonTemplateDirective } from './rating-input.directives';
import { ArdRatingInputStarButtonTemplateContext } from './rating-input.types';

@Component({
  standalone: false,
  selector: 'ard-rating-input',
  templateUrl: './rating-input.component.html',
  styleUrls: ['./rating-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumRatingInputComponent),
      multi: true,
    },
  ],
})
export class ArdiumRatingInputComponent extends _NgModelComponentBase implements ControlValueAccessor {
  readonly wrapperClasses = input<string>('');

  protected override readonly _DEFAULTS!: ArdRatingInputDefaults;

  //! appearance
  readonly color = input<StarColor>(this._DEFAULTS.color);

  readonly ngClasses = computed<string>(() => [this.wrapperClasses(), `ard-color-${this.color()}`].join(' '));

  //! events
  readonly highlightEvent = output<number>({ alias: 'highlight' });

  readonly value = model<number | null>(null);

  constructor(@Inject(ARD_RATING_INPUT_DEFAULTS) defaults: ArdRatingInputDefaults) {
    super(defaults);
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
  readonly max = input<number, any>(this._DEFAULTS.max, { transform: v => coerceNumberProperty(v, this._DEFAULTS.max) });

  readonly starButtonInstances = viewChildren<ArdiumStarButtonComponent>('starButton');
  private readonly _highlightedStarIndex = signal<number | null>(null);

  readonly starArray = computed<number[]>(() => new Array(this.max()).fill(0).map((_, i) => i));

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
  }

  //* focus handlers
  private _isFocusEventSuppressed = false;
  private _isBlurEventSuppressed = false;
  private _currentFocusIndex: number | null = null;
  onStarButtonFocus(event: FocusEvent, index: number) {
    this._currentFocusIndex = index;
    if (this._isFocusEventSuppressed) {
      this._isFocusEventSuppressed = false;
      return;
    }
    this.focusEvent.emit(event);
  }
  onStarButtonBlur(event: FocusEvent): void {
    this._currentFocusIndex = null;
    if (this._isBlurEventSuppressed) {
      this._isBlurEventSuppressed = false;
      return;
    }
    this.blurEvent.emit(event);
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

  //! template
  readonly starButtonTemplate = contentChild(ArdRatingInputStarButtonTemplateDirective);

  readonly getStarButtonTemplateContext = computed<(index: number) => ArdRatingInputStarButtonTemplateContext>(() => index => ({
    color: this.color(),
    index,
    highlightedIndex: this._highlightedStarIndex() ?? -1,
    valueIndex: (this.value() ?? 0) - 1,
    tabIndex: this.tabIndex(),
    onClick: () => {
      this.onStarClick(index);
    },
    onFocus: (event: FocusEvent) => {
      this.onStarButtonFocus(event, index);
    },
    onBlur: (event: FocusEvent) => {
      this.onStarButtonBlur(event);
    },
    onHighlight: () => {
      this.onStarHighlight(index);
    },
  }));
}
