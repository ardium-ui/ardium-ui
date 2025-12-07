import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  HostListener,
  Inject,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { roundToPrecision } from 'more-rounding';
import { _AbstractSlider } from './abstract-slider';
import { ARD_SLIDER_DEFAULTS, ArdSliderDefaults } from './slider.defaults';
import { SliderTooltipContext } from './slider.types';

@Component({
  standalone: false,
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
export class ArdiumSliderComponent extends _AbstractSlider<number> implements FormValueControl<number> {
  readonly componentId = '105';
  readonly componentName = 'slider';

  protected override readonly _DEFAULTS!: ArdSliderDefaults;
  constructor(@Inject(ARD_SLIDER_DEFAULTS) defaults: ArdSliderDefaults) {
    super(defaults);
  }

  //! value input & output
  readonly value = model<number>(0);

  private readonly _ = effect(() => {
    this.value();
    this._emitChange();
  });

  //! tooltip updater
  protected readonly _tooltipValue = computed<string>(() => {
    let v: string | number = this.value();
    const formatFn = this.tooltipFormatFn();
    if (formatFn) v = formatFn(v);
    return String(v);
  });

  readonly getTooltipContext = computed((): SliderTooltipContext => {
    return {
      value: this._tooltipValue(),
      $implicit: this._tooltipValue(),
    };
  });

  //! writeValue
  writeValue(v: any): void {
    v = Number(v);
    if (isNaN(v)) {
      this.reset();
      return;
    }
    v = this._clampValue(v);
    this.value.set(v);
  }

  //! methods for programmatic manipulation
  reset(): void {
    this.writeValue(this.minNumber());
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
    const minMaxDifference = Math.abs(this.minNumber() - this.maxNumber());
    const newVal = percent * minMaxDifference + this.minNumber();
    //round to 9 decimal places to avoid floating point arithmetic errors
    //9 is an arbitrary number that just works well. ¯\_(ツ)_/¯
    return roundToPrecision(newVal, 9);
  }
}
