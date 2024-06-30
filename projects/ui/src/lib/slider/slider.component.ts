import { ChangeDetectionStrategy, Component, forwardRef, HostListener, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { roundToPrecision } from 'more-rounding';
import { _AbstractSlider } from './abstract-slider';
import { SliderTooltipContext } from './slider.types';

@Component({
  selector: 'ard-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumSliderComponent),
      multi: true,
    },
  ],
})
export class ArdiumSliderComponent extends _AbstractSlider<number> {
  readonly componentId = '105';
  readonly componentName = 'slider';

  //! value input & output
  protected _value = 0;

  //! tooltip updater
  _tooltipValue = String(this.value);

  protected _updateTooltipValue(): void {
    let v: string | number = this._value;
    const formatFn = this.tooltipFormat();
    if (formatFn) v = formatFn(v);
    this._tooltipValue = String(v);
  }

  getTooltipContext(): SliderTooltipContext {
    return {
      value: this._tooltipValue,
      $implicit: this._tooltipValue,
    };
  }

  //! writeValue
  writeValue(v: any): void {
    v = Number(v);
    if (isNaN(v)) {
      this.reset();
      return;
    }
    v = this._clampValue(v);
    this._value = v;
    this._positionPercent[0] = this._valueToPercent(v);
    this._updateTooltipValue();
  }

  //! methods for programmatic manipulation
  reset(): void {
    this._value = 0;
    this._positionPercent[0] = 0;
  }
  increment(steps = 1): void {
    this._offset(steps, false);
  }
  decrement(steps = 1): void {
    this._offset(-steps, false);
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
    this._writeValueFromEvent(event);
  }

  //! position calculators
  protected _percentValueToValue(percent: number): number {
    const minMaxDifference = Math.abs(this.min() - this.max());
    const newVal = percent * minMaxDifference + this.min();
    //round to 9 decimal places to avoid floating point arithmetic errors
    //9 is an arbitrary number that just works well. ¯\_(ツ)_/¯
    return roundToPrecision(newVal, 9);
  }
}
