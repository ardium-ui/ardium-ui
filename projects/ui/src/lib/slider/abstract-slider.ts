import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
    ViewContainerRef,
    computed,
    contentChild,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { roundToMultiple, roundToPrecision } from 'more-rounding';
import { isDefined, isObject } from 'simple-bool';
import { _NgModelComponentBase, _NgModelComponentDefaults, _ngModelComponentDefaults } from '../_internal/ngmodel-component';
import { SimpleComponentColor } from '../types/colors.types';
import { Nullable } from '../types/utility.types';
import { ArdSliderTooltipDirective } from './slider.directive';
import {
    SliderDecorationPosition,
    SliderLabelObject,
    SliderTooltipBehavior,
    SliderTooltipFormatFn,
    _InternalSliderLabelObject,
} from './slider.types';

export interface _AsbtractSliderDefaults extends _NgModelComponentDefaults {
  noTooltip: boolean;
  showValueTicks: boolean;
  formatTooltipFn: Nullable<SliderTooltipFormatFn>;
  min: number;
  max: number;
  step: number;
  shiftMultiplier: number;
  labelPosition: SliderDecorationPosition;
  labels: SliderLabelObject[] | number[] | null;
  color: SimpleComponentColor;
  compact: boolean;
  tooltipPosition: SliderDecorationPosition;
  tooltipBehavior: SliderTooltipBehavior;
}

export const _asbtractSliderDefaults: _AsbtractSliderDefaults = {
  ..._ngModelComponentDefaults,
  noTooltip: false,
  showValueTicks: false,
  formatTooltipFn: undefined,
  min: 0,
  max: 100,
  step: 1,
  shiftMultiplier: 5,
  labelPosition: SliderDecorationPosition.Bottom,
  labels: [],
  color: SimpleComponentColor.Primary,
  compact: false,
  tooltipPosition: SliderDecorationPosition.Top,
  tooltipBehavior: SliderTooltipBehavior.Auto,
};

@Directive()
export abstract class _AbstractSlider<T> extends _NgModelComponentBase {
  abstract readonly componentId: string;
  abstract readonly componentName: string;

  protected override readonly _DEFAULTS!: _AsbtractSliderDefaults;

  public readonly elementRef = viewChild<ElementRef<HTMLElement>>('track');

  protected readonly document = inject(DOCUMENT);
  protected readonly renderer = inject(Renderer2);
  protected readonly overlay = inject(Overlay);
  protected readonly scrollStrategyOpts = inject(ScrollStrategyOptions);
  protected readonly viewContainerRef = inject(ViewContainerRef);

  readonly noTooltip = input<boolean, any>(this._DEFAULTS.noTooltip, { transform: v => coerceBooleanProperty(v) });

  readonly tooltipFormatFn = input<Nullable<SliderTooltipFormatFn>>(this._DEFAULTS.formatTooltipFn);

  protected abstract _updateTooltipValue(): void;

  //! min, max, step sizes
  readonly min = input<number, any>(this._DEFAULTS.min, { transform: v => coerceNumberProperty(v, this._DEFAULTS.min) });
  readonly max = input<number, any>(this._DEFAULTS.max, { transform: v => coerceNumberProperty(v, this._DEFAULTS.max) });

  readonly step = input<number, any>(this._DEFAULTS.step, {
    transform: v => {
      const step = coerceNumberProperty(v, this._DEFAULTS.step);
      if (step === 0) {
        throw new Error(`ARD-FT${this.componentId}0a: Cannot set <ard-${this.componentName}>'s [step] to 0.`);
      }
      if (step < 0) {
        throw new Error(
          `ARD-FT${this.componentId}0b: Cannot set <ard-${this.componentName}>'s [step] to a negative value, got ${step}.`
        );
      }
      return step;
    },
  });

  readonly shiftMultiplier = input<number, any>(this._DEFAULTS.shiftMultiplier, {
    transform: v => coerceNumberProperty(v, this._DEFAULTS.shiftMultiplier),
  });

  protected readonly _stepSizeComputed = computed<number>(() => this.step() / Math.abs(this.min() - this.max()));

  //! value ticks
  readonly showValueTicks = input<boolean, any>(this._DEFAULTS.showValueTicks, { transform: v => coerceBooleanProperty(v) });

  readonly percentStepSize = computed<number>(() => this._stepSizeComputed() * 100);

  protected readonly _tickArray = computed<string[]>(() => {
    const newArr: number[] = [];

    let positionPercentCumulative = 0;
    while (positionPercentCumulative < 100) {
      newArr.push(positionPercentCumulative);
      positionPercentCumulative += this._stepSizeComputed() * 100;
      positionPercentCumulative = roundToPrecision(positionPercentCumulative, 6);
    }
    newArr.push(100);

    return newArr.map(v => `${v}%`);
  });

  //! labels
  readonly labelPosition = input<SliderDecorationPosition>(this._DEFAULTS.labelPosition);

  readonly labelObjects = input<_InternalSliderLabelObject[], SliderLabelObject[] | number[] | null>(
    this._transformLabelObjects(this._DEFAULTS.labels),
    {
      alias: 'labels',
      transform: this._transformLabelObjects,
    }
  );
  private _transformLabelObjects(v: SliderLabelObject[] | number[] | null): _InternalSliderLabelObject[] {
    if (!isDefined(v) || v.length === 0) {
      return [];
    }
    return v.map(this._numberLabelArrayMapFn).map(label => {
      const v = this._clampValue(label.for);
      return {
        label: String(label.label),
        positionPercent: `${this._valueToPercent(v) * 100}%`,
      };
    });
  }

  protected _numberLabelArrayMapFn(val: SliderLabelObject | number): SliderLabelObject {
    if (isObject(val)) return val;
    return {
      label: val,
      for: val,
    };
  }

  //! appearance
  readonly color = input<SimpleComponentColor>(SimpleComponentColor.Primary);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed<string>(() =>
    [
      `ard-color-${this.color()}`,
      `ard-labels-${this.labelPosition()}`,
      `ard-tooltip-${this.tooltipPosition()}`,
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );

  //! determining transition
  readonly sliderTransition = computed(() => {
    const x = this._totalSteps();
    //this is determined using this graph: https://www.geogebra.org/calculator/nqgnhpap
    //capped at y=80
    //this specific graph is chosen because it looks the best in my opinion
    const formulaResult = (20 * (x + 200)) / (x + 20) - 80;
    const formulaResultRounded = roundToPrecision(formulaResult, 3);

    if (formulaResultRounded < 0) return '0';

    const transitionDuration = Math.min(80, formulaResultRounded);
    return transitionDuration + 'ms';
  });
  private readonly _totalSteps = computed<number>(() => (this.max() - this.min()) / this.step());

  //! value input & output
  //! abstract here
  protected abstract _value: T;
  @Input()
  set value(newValue: T) {
    this.writeValue(newValue);
  }
  get value(): T {
    return this._value;
  }
  readonly valueChange = output<T>();

  //! writeValue
  //! abstract here
  abstract override writeValue(v: any): void; //* abstact
  //! methods for programmatic manipulation
  abstract reset(): void;

  protected _offset(offset: number, hasShift: boolean, handleId = 1): void {
    const stepSize = this._stepSizeComputed() * (hasShift ? this.shiftMultiplier() : 1);
    let newPercent = this._positionPercent[handleId - 1] + stepSize * offset;
    newPercent = this._clampPercentValue(newPercent);
    this._setValueFromPercent(newPercent);
  }

  //! helper methods
  protected _clampValue(v: number): number {
    //clamp between min and max
    v = Math.min(v, this.max());
    v = Math.max(v, this.min());
    //round to the nearest step
    v -= this.min();
    v = roundToMultiple(v, this.step());
    v += this.min();
    return v;
  }
  protected _valueToPercent(v: number): number {
    const minMaxDifference = Math.abs(this.min() - this.max());
    return (v - this.min()) / minMaxDifference;
  }
  protected _emitChange(): void {
    const v = this.value;
    this._onChangeRegistered?.(v);
    this.valueChange.emit(v);
  }

  //! tooltip
  readonly tooltipTemplate = contentChild(ArdSliderTooltipDirective);

  readonly tooltipPosition = input<SliderDecorationPosition>(SliderDecorationPosition.Top);
  readonly tooltipBehavior = input<SliderTooltipBehavior>(SliderTooltipBehavior.Auto);

  //! event handlers
  protected readonly _grabbedHandleId = signal<null | number>(null);
  protected _shouldCheckForMovement = false;
  protected _bodyHasClass = false;

  readonly isSliderHandleGrabbed = computed(() => !!this._grabbedHandleId());

  abstract onTrackHitboxPointerDown(event: MouseEvent | TouchEvent): void; //* abstact

  onPointerDownOnHandle(event: MouseEvent | TouchEvent, handleId = 1): void {
    this._grabbedHandleId.set(handleId);
    this._shouldCheckForMovement = true;
    if (!this._bodyHasClass) {
      this._bodyHasClass = true;
      this.renderer.addClass(this.document.body, 'ard-prevent-touch-actions');
    }
  }

  abstract onPointerMove(event: MouseEvent | TouchEvent): void; //* abstact

  @HostListener('document:pointerup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onPointerUp(): void {
    if (!this._shouldCheckForMovement) return;
    this._grabbedHandleId.set(null);
    this._shouldCheckForMovement = false;
    if (this._bodyHasClass) {
      this._bodyHasClass = false;
      this.renderer.removeClass(this.document.body, 'ard-prevent-touch-actions');
    }
  }

  //! position calculators
  protected _positionPercent: [number] | [number, number] = [0];
  getHandlePosition(handleId = 1): string {
    return this._positionPercent[handleId - 1] * 100 + '%';
  }
  protected _setValueFromPercent(percent: number, handleId: number | null = 1): void {
    if (!handleId) return;
    if (this._positionPercent[handleId - 1] === percent) return;
    this._positionPercent[handleId - 1] = percent;
    this._value = this._percentValueToValue(percent, handleId);

    this._updateTooltipValue();

    this._emitChange();
  }
  protected _writeValueFromEvent(event: MouseEvent | TouchEvent, handleId?: number | null): void {
    const percent = this._getPercentValueFromEvent(event);
    this._setValueFromPercent(percent, handleId);
  }
  protected abstract _percentValueToValue(percent: number, handleId?: number): T; //* abstact

  protected _getElementRect(): DOMRect {
    return this.elementRef()!.nativeElement.getBoundingClientRect();
  }
  protected _clampPercentValue(percent: number): number {
    //clamp between 0 and 1
    percent = Math.min(percent, 1);
    percent = Math.max(percent, 0);
    //round to the nearest step
    percent = roundToMultiple(percent, this._stepSizeComputed());
    return percent;
  }
  protected _getPercentValueFromEvent(event: MouseEvent | TouchEvent): number {
    const rect = this._getElementRect();
    let position: number;
    if (event instanceof MouseEvent) {
      position = event.clientX;
    } else {
      position = event.targetTouches[0].clientX;
    }
    const percent = (position - rect.left) / rect.width;
    return this._clampPercentValue(percent);
  }
  //! key press handlers
  @HostListener('keydown', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowLeft': {
        this._decrement(event);
        return;
      }
      case 'ArrowRight': {
        this._increment(event);
        return;
      }
    }
  }
  protected _decrement(event: KeyboardEvent, steps = 1): void {
    this._offset(-steps, event.shiftKey);
  }
  protected _increment(event: KeyboardEvent, steps = 1): void {
    this._offset(+steps, event.shiftKey);
  }
}
