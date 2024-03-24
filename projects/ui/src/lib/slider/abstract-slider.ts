import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    Input,
    Output,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { roundToMultiple, roundToPrecision } from 'more-rounding';
import { isDefined, isObject } from 'simple-bool';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { SimpleComponentColor } from '../types/colors.types';
import { ArdSliderTooltipDirective } from './slider.directive';
import { SliderDecorationPosition, SliderLabelObject, SliderTooltipBehavior, SliderTooltipFormatFn, _InternalSliderLabelObject } from './slider.types';

@Directive()
export abstract class _AbstractSlider<T> extends _NgModelComponentBase {
    @ViewChild('track')
    public readonly element!: ElementRef<HTMLElement>;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        protected renderer: Renderer2,
        protected overlay: Overlay,
        protected scrollStrategyOpts: ScrollStrategyOptions,
        protected viewContainerRef: ViewContainerRef
    ) {
        super();
    }

    private _noTooltip: boolean = false;
    @Input()
    get noTooltip(): boolean {
        return this._noTooltip;
    }
    set noTooltip(v: any) {
        this._noTooltip = coerceBooleanProperty(v);
    }

    @Input() tooltipFormat?: SliderTooltipFormatFn;

    protected abstract _updateTooltipValue(): void;

    //! min, max, step sizes
    protected _min: number = 0;
    @Input()
    get min(): number {
        return this._min;
    }
    set min(v: any) {
        this._min = coerceNumberProperty(v, 0);
        this._updateComputedStepSizes();
        this._updateTickArray();
    }
    protected _max: number = 100;
    @Input()
    get max(): number {
        return this._max;
    }
    set max(v: any) {
        this._max = coerceNumberProperty(v, 100);
        this._updateComputedStepSizes();
        this._updateTickArray();
    }
    protected _step: number = 1;
    @Input()
    get step(): number {
        return this._step;
    }
    set step(v: any) {
        this._step = coerceNumberProperty(v, 0.5);
        if (this._step <= 0) {
            throw new Error('Cannot use negative or zero step size for a slider.');
        }
        this._updateComputedStepSizes();
        this._updateTickArray();
    }
    protected _shiftMultiplier: number = 5;
    @Input()
    get shiftMultiplier(): number {
        return this._shiftMultiplier;
    }
    set shiftMultiplier(v: any) {
        this._shiftMultiplier = coerceNumberProperty(v, 1);
    }

    protected _stepSizeComputed: number = this._updateComputedStepSizes();
    protected _updateComputedStepSizes(): number {
        const minMaxDifference = Math.abs(this._min - this._max);
        this._stepSizeComputed = this._step / minMaxDifference;
        return this._stepSizeComputed;
    }

    //! value ticks
    protected _showValueTicks: boolean = false;
    @Input()
    get showValueTicks(): boolean {
        return this._showValueTicks;
    }
    set showValueTicks(v: any) {
        this._showValueTicks = coerceBooleanProperty(v);
    }

    get percentStepSize(): number {
        return this._stepSizeComputed * 100;
    }
    protected _tickArray: string[] = this._updateTickArray();
    protected _updateTickArray(): string[] {
        let newArr: number[] = [];
        let positionPercentCumulative: number = 0;

        while (positionPercentCumulative < 100) {
            newArr.push(positionPercentCumulative);
            positionPercentCumulative += this._stepSizeComputed * 100;
            positionPercentCumulative = roundToPrecision(positionPercentCumulative, 6);
        }
        newArr.push(100);

        let stringArr = newArr.map(v => `${v}%`);

        this._tickArray = stringArr;
        return stringArr;
    }
    get tickArray(): string[] {
        return this._tickArray;
    }

    //! labels
    @Input() labelPosition: SliderDecorationPosition = SliderDecorationPosition.Bottom;
    public labelObjects: _InternalSliderLabelObject[] = [];
    @Input()
    set labels(val: SliderLabelObject[] | number[] | null) {
        if (!isDefined(val) || val.length == 0) {
            this.labelObjects = [];
            return;
        }
        this.labelObjects = val.map(this._numberLabelArrayMapFn).map(label => {
            let v = this._clampValue(label.for);
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
    @Input() color: SimpleComponentColor = SimpleComponentColor.Primary;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean {
        return this._compact;
    }
    set compact(v: any) {
        this._compact = coerceBooleanProperty(v);
    }

    get ngClasses(): string {
        return [`ard-color-${this.color}`, `ard-labels-${this.labelPosition}`, `ard-tooltip-${this.tooltipPosition}`, this.compact ? 'ard-compact' : ''].join(
            ' '
        );
    }

    //! determining transition
    get sliderTransition(): string {
        const x = this._totalSteps;
        //this is determined using this graph: https://www.geogebra.org/calculator/nqgnhpap
        //capped at y=80
        const formulaResult = (20 * (x + 200)) / (x + 20) - 80;
        const formulaResultRounded = roundToPrecision(formulaResult, 3);

        if (formulaResultRounded < 0) return '0';

        const transitionDuration = Math.min(80, formulaResultRounded);
        return transitionDuration + 'ms';
    }
    private get _totalSteps(): number {
        return (this.max - this.min) / this.step;
    }

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
    @Output() valueChange = new EventEmitter<T>();

    //! writeValue
    //! abstract here
    abstract override writeValue(v: any): void; //* abstact
    //! methods for programmatic manipulation
    abstract reset(): void;

    protected _offset(offset: number, hasShift: boolean, handleId: number = 1): void {
        let stepSize = this._stepSizeComputed * (hasShift ? this._shiftMultiplier : 1);
        let newPercent = this._positionPercent[handleId - 1] + stepSize * offset;
        newPercent = this._clampPercentValue(newPercent);
        this._setValueFromPercent(newPercent);
    }

    //! helper methods
    protected _clampValue(v: number): number {
        //clamp between min and max
        v = Math.min(v, this._max);
        v = Math.max(v, this._min);
        //round to the nearest step
        v -= this._min;
        v = roundToMultiple(v, this._step);
        v += this._min;
        return v;
    }
    protected _valueToPercent(v: number): number {
        const minMaxDifference = Math.abs(this._min - this._max);
        return (v - this._min) / minMaxDifference;
    }
    protected _emitChange(): void {
        let v = this.value;
        this._onChangeRegistered?.(v);
        this.valueChange.emit(v);
    }

    //! tooltip
    @ContentChild(ArdSliderTooltipDirective, { read: TemplateRef })
    tooltipTemplate?: TemplateRef<any>;

    @Input() tooltipPosition: SliderDecorationPosition = SliderDecorationPosition.Top;

    private _tooltipBehavior: SliderTooltipBehavior = SliderTooltipBehavior.Auto;
    @Input()
    set tooltipBehavior(v: SliderTooltipBehavior) {
        this._tooltipBehavior = v;
    }
    get tooltipBehavior(): SliderTooltipBehavior {
        return this._tooltipBehavior;
    }

    //! event handlers
    protected _isGrabbed: number = 0;
    protected _shouldCheckForMovement: boolean = false;
    protected _bodyHasClass: boolean = false;

    get isSliderHandleGrabbed(): boolean {
        return this._isGrabbed != 0;
    }
    abstract onTrackHitboxPointerDown(event: MouseEvent | TouchEvent): void; //* abstact

    onPointerDownOnHandle(event: MouseEvent | TouchEvent, handleId: number = 1): void {
        this._isGrabbed = handleId;
        this._shouldCheckForMovement = true;
        if (!this._bodyHasClass) {
            this._bodyHasClass = true;
            this.renderer.addClass(this.document.body, 'ard-prevent-touch-actions');
        }
    }

    abstract onPointerMove(event: MouseEvent | TouchEvent): void; //* abstact

    @HostListener('document:pointerup', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onPointerUp(event: MouseEvent | TouchEvent): void {
        if (!this._shouldCheckForMovement) return;
        this._isGrabbed = 0;
        this._shouldCheckForMovement = false;
        if (this._bodyHasClass) {
            this._bodyHasClass = false;
            this.renderer.removeClass(this.document.body, 'ard-prevent-touch-actions');
        }
    }

    //! position calculators
    protected _positionPercent: [number] | [number, number] = [0];
    getHandlePosition(handleId: number = 1): string {
        return this._positionPercent[handleId - 1] * 100 + '%';
    }
    protected _setValueFromPercent(percent: number, handleId: number = 1): void {
        if (this._positionPercent[handleId - 1] == percent) return;
        this._positionPercent[handleId - 1] = percent;
        this._value = this._percentValueToValue(percent, handleId);

        this._updateTooltipValue();

        this._emitChange();
    }
    protected _writeValueFromEvent(event: MouseEvent | TouchEvent, handleId?: number): void {
        let percent = this._getPercentValueFromEvent(event);
        this._setValueFromPercent(percent, handleId);
    }
    protected abstract _percentValueToValue(percent: number, handleId?: number): T; //* abstact

    protected _getElementRect(): DOMRect {
        return this.element.nativeElement.getBoundingClientRect();
    }
    protected _clampPercentValue(percent: number): number {
        //clamp between 0 and 1
        percent = Math.min(percent, 1);
        percent = Math.max(percent, 0);
        //round to the nearest step
        percent = roundToMultiple(percent, this._stepSizeComputed);
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
        let percent = (position - rect.left) / rect.width;
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
    protected _decrement(event: KeyboardEvent, steps: number = 1): void {
        this._offset(-steps, event.shiftKey);
    }
    protected _increment(event: KeyboardEvent, steps: number = 1): void {
        this._offset(+steps, event.shiftKey);
    }
}
