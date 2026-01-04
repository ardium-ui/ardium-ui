import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { roundToPrecision } from 'more-rounding';
import { isNumber, isObject } from 'simple-bool';
import { _AbstractSlider } from '../abstract-slider';
import { ARD_SLIDER_DEFAULTS, ArdSliderDefaults } from '../slider.defaults';
import { SliderRange, SliderTooltipContext } from '../slider.types';

@Component({
  standalone: false,
  selector: 'ard-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumRangeSliderComponent extends _AbstractSlider<SliderRange> implements OnInit {
  readonly componentId = '106';
  readonly componentName = 'range-slider';

  protected override readonly _DEFAULTS!: ArdSliderDefaults;
  constructor(@Inject(ARD_SLIDER_DEFAULTS) defaults: ArdSliderDefaults) {
    super(defaults);
  }

  protected _value: SliderRange = { from: -Number.MIN_SAFE_INTEGER, to: Number.MIN_SAFE_INTEGER };

  //! writeValue
  private _isValidObject(v: any): v is SliderRange {
    return isObject(v) && isNumber(v['from']) && isNumber(v['to']);
  }
  private _isValidTuple(v: any): v is [number, number] {
    return Array.isArray(v) && isNumber(v[0]) && isNumber(v[1]) && v.length === 2;
  }
  private _arrayValueToObjectValue(v: [number, number]): SliderRange {
    return { from: v[0], to: v[1] };
  }
  private _normalizeSliderRange(v: SliderRange): SliderRange {
    if (v.from <= v.to) return v;
    return { from: v.to, to: v.from };
  }
  writeValue(v: any): void {
    if (!this._isValidObject(v) && !this._isValidTuple(v)) {
      this.reset();
      return;
    }
    let from = -Number.MIN_SAFE_INTEGER;
    let to = Number.MIN_SAFE_INTEGER;
    if (this._isValidObject(v)) {
      from = v.from;
      to = v.to;
    } else if (this._isValidTuple(v)) {
      from = v[0];
      to = v[1];
    }
    const fromClamped = this._clampValue(from);
    const toClamped = this._clampValue(to);
    const value: SliderRange = this._arrayValueToObjectValue([fromClamped, toClamped]);
    this._value = value;
    this._positionPercent[0] = this._valueToPercent(fromClamped);
    this._positionPercent[1] = this._valueToPercent(toClamped);
    this._updateTooltipValue();
  }
  override get value(): SliderRange {
    return this._normalizeSliderRange(this._value);
  }
  override set value(v: any) {
    this.writeValue(v);
  }
  cleanupValueAfterMinMaxStepChange(): void {
    const prevValue = this._value;
    this.writeValue(this._value);

    if (prevValue.from !== this._value.from || prevValue.to !== this._value.to) {
      this._emitChange();
    }
  }

  //! tooltip updater
  _tooltipValue: SliderRange<string | number> = this.value;

  protected _updateTooltipValue(): void {
    const v: SliderRange<string | number> = Object.create(this._value);
    const formatFn = this.tooltipFormatFn();
    if (formatFn) {
      v.from = formatFn(v.from as number);
      v.to = formatFn(v.to as number);
    }
    this._tooltipValue = v;
  }

  getTooltipContext(type: 'from' | 'to'): SliderTooltipContext {
    return {
      value: this._tooltipValue[type],
      $implicit: this._tooltipValue[type],
    };
  }

  //! methods for programmatic manipulation
  reset(): void {
    this._value = { from: -this.min(), to: this.max() };
    this._positionPercent[0] = 0;
    this._positionPercent[1] = 1;
  }

  //! track overlay getters
  get trackOverlayLeft(): string {
    return Math.min(...this._positionPercent) * 100 + '%';
  }
  get trackOverlayWidth(): string {
    return Math.abs(this._positionPercent[0] - this._positionPercent[1]!) * 100 + '%';
  }

  //! event handlers
  onTrackHitboxPointerDown(event: MouseEvent | TouchEvent): void {
    this._writeValueFromEvent(event);
    this.onPointerDownOnHandle(event);
  }
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onPointerMove(event: MouseEvent | TouchEvent): void {
    if (!this._shouldCheckForMovement) return;
    if (!this._bodyHasClass) {
      this._bodyHasClass = true;
      this.renderer.addClass(this.document.body, 'ard-prevent-touch-actions');
    }
    this._writeValueFromEvent(event, this._grabbedHandleId());
  }

  //! position calculators
  protected _percentValueToValue(percent: number, handleId: number): SliderRange {
    const minMaxDifference = Math.abs(this.min() - this.max());
    let newVal = percent * minMaxDifference + this.min();
    //round to 9 decimal places to avoid floating point arithmetic errors
    //9 is an arbitrary number that just works well. ¯\_(ツ)_/¯
    newVal = roundToPrecision(newVal, 9);

    const newValObj = { from: this._value.from, to: this._value.to };
    if (handleId === 1) {
      newValObj.from = newVal;
    } else {
      newValObj.to = newVal;
    }
    return newValObj;
  }

  //! handle focus monitors
  readonly currentHandle = signal<1 | 2 | null>(null);
  onHandleFocus(event: FocusEvent, handleId: 1 | 2) {
    this.onFocus(event);

    this.currentHandle.set(handleId);
  }
  override onBlur(event: FocusEvent) {
    super.onBlur(event);
    this.currentHandle.set(null);
  }
}
