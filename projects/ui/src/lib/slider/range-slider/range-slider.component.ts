import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  computed,
  model,
  signal
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
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
export class ArdiumRangeSliderComponent extends _AbstractSlider<SliderRange> implements OnChanges, FormValueControl<SliderRange> {
  readonly componentId = '106';
  readonly componentName = 'range-slider';

  protected override readonly _DEFAULTS!: ArdSliderDefaults;
  constructor(@Inject(ARD_SLIDER_DEFAULTS) defaults: ArdSliderDefaults) {
    super(defaults);
  }

  readonly value = model<SliderRange>({ low: this._DEFAULTS.min, high: this._DEFAULTS.max });

  readonly normalizedValue = computed<SliderRange>(() => this._normalizeSliderRange(this.value()));

  // private readonly _ = effect(() => {
  //   this.normalizedValue();
  //   this._emitChange();
  // });

  override ngOnChanges(changes: SimpleChanges): void {
    if (changes['min'] || changes['max']) {
      const v = changes['value']?.currentValue ?? this.value();
      if (
        (changes['min'] && changes['min'].currentValue !== changes['min'].previousValue && changes['min'].currentValue > v.low) ||
        (changes['max'] && changes['max'].currentValue !== changes['max'].previousValue && changes['max'].currentValue < v.high)
      ) {
        this.writeValue({
          low: Math.max(changes['min'].currentValue ?? this.minNumber(), v.low),
          high: Math.min(changes['max'].currentValue ?? this.maxNumber(), v.high),
        });
      }
    } else {
      super.ngOnChanges(changes);
    }
  }

  //! writeValue
  private _isValidObject(v: any): v is SliderRange {
    return isObject(v) && isNumber(v['low']) && isNumber(v['high']);
  }
  private _isValidTuple(v: any): v is [number, number] {
    return Array.isArray(v) && isNumber(v[0]) && isNumber(v[1]) && v.length === 2;
  }
  private _arrayValueToObjectValue(v: [number, number]): SliderRange {
    return { low: v[0], high: v[1] };
  }
  private _normalizeSliderRange(v: SliderRange): SliderRange {
    if (v.low <= v.high) return v;
    return { low: v.high, high: v.low };
  }
  writeValue(v: any): void {
    if (!this._isValidObject(v) && !this._isValidTuple(v)) {
      this.reset();
      return;
    }
    let low = -Infinity;
    let high = Infinity;
    if (this._isValidObject(v)) {
      low = v.low;
      high = v.high;
    } else if (this._isValidTuple(v)) {
      low = v[0];
      high = v[1];
    }
    const lowClamped = this._clampValue(low);
    const highClamped = this._clampValue(high);
    const value: SliderRange = this._normalizeSliderRange(this._arrayValueToObjectValue([lowClamped, highClamped]));
    this.value.set(value);
  }

  //! tooltip updater
  protected readonly _tooltipValue = computed<SliderRange<string | number>>(() => {
    const v: SliderRange<string | number> = Object.create(this.value());
    const formatFn = this.tooltipFormatFn();
    if (formatFn) {
      v.low = formatFn(v.low as number);
      v.high = formatFn(v.high as number);
    }
    return v;
  });

  readonly getTooltipContexts = computed((): SliderRange<SliderTooltipContext> => {
    return {
      low: {
        value: this._tooltipValue().low,
        $implicit: this._tooltipValue().low,
      },
      high: {
        value: this._tooltipValue().high,
        $implicit: this._tooltipValue().high,
      },
    };
  });

  //! methods for programmatic manipulation
  reset(): void {
    this.value.set({ low: this.minNumber(), high: this.maxNumber() });
  }

  //! track overlay getters
  readonly trackOverlayLeft = computed<string>(() => Math.min(...this.positionPercent()) * 100 + '%');
  readonly trackOverlayWidth = computed<string>(
    () => Math.abs(this.positionPercent()[0] - this.positionPercent()[1]!) * 100 + '%'
  );

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
    const minMaxDifference = Math.abs(this.minNumber() - this.maxNumber());
    let newVal = percent * minMaxDifference + this.minNumber();
    //round to 9 decimal places to avoid floating point arithmetic errors
    //9 is an arbitrary number that just works well. ¯\_(ツ)_/¯
    newVal = roundToPrecision(newVal, 9);

    const newValObj = { low: this.normalizedValue().low, high: this.normalizedValue().high };
    if (handleId === 1) {
      newValObj.low = newVal;
    } else {
      newValObj.high = newVal;
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
