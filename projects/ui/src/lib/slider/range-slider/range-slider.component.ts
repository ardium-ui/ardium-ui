import { ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { roundToPrecision } from 'more-rounding';
import { isNumber, isObject } from 'simple-bool';
import { _AbstractSlider } from '../abstract-slider';
import { SliderRange } from '../slider.types';
import { isDefined } from 'simple-bool';

@Component({
    selector: 'ard-range-slider',
    templateUrl: './range-slider.component.html',
    styleUrls: ['./range-slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumRangeSliderComponent extends _AbstractSlider<SliderRange> implements OnInit {
    protected _value: SliderRange = { low: -Infinity, high: Infinity };

    override ngOnInit(): void {
        this.writeValue({ low: this._min, high: this._max });
    }

    //! writeValue
    private _isValidObject(v: any): v is SliderRange {
        return isObject(v) && isNumber(v['low']) && isNumber(v['high']);
    }
    private _isValidTuple(v: any): v is [number, number] {
        return Array.isArray(v) && isNumber(v[0]) && isNumber(v[1]) && v.length == 2;
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
        let low: number = -Infinity;
        let high: number = Infinity;
        if (this._isValidObject(v)) {
            low = v.low;
            high = v.high;
        }
        else if (this._isValidTuple(v)) {
            low = v[0];
            high = v[1];
        }
        let lowClamped = this._clampValue(low);
        let highClamped = this._clampValue(high);
        let value: SliderRange = this._arrayValueToObjectValue([lowClamped, highClamped]);
        this._value = this._normalizeSliderRange(value);
        this._positionPercent[0] = this._valueToPercent(lowClamped);
        this._positionPercent[1] = this._valueToPercent(highClamped);
        this._updateTooltipValue();
    }
    override get value(): SliderRange {
        return this._normalizeSliderRange(this._value);
    }

    //! tooltip updater
    _tooltipValue: SliderRange<string | number> = this.value;

    protected _updateTooltipValue(): void {
        let v: SliderRange<string | number> = {
            low: this.value.low,
            high: this.value.high,
        }
        if (this.tooltipFormat) {
            v.low = this.tooltipFormat(v.low as number);
            v.high = this.tooltipFormat(v.high as number);
        }
        this._tooltipValue = v;
    }

    //! methods for programmatic manipulation
    reset(): void {
        this._value = { low: -Infinity, high: Infinity };
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
        this._writeValueFromEvent(event, this._isGrabbed);
    }

    //! position calculators
    protected _percentValueToValue(percent: number, handleId: number): SliderRange {
        const minMaxDifference = Math.abs(this._min - this._max);
        let newVal = percent * minMaxDifference + this._min;
        newVal = roundToPrecision(newVal, 12);

        const newValObj = { low: this._value.low, high: this._value.high };
        if (handleId == 1) {
            newValObj.low = newVal;
        }
        else {
            newValObj.high = newVal;
        }
        return newValObj; //round to 12 decimal places to avoid floating point arithmetic errors
    }

    //! handle focus monitors
    currentHandle: 1 | 2 | null = null;
    onHandleFocus(event: FocusEvent, handleId: 1 | 2) {
        this.onFocus(event);

        this.currentHandle = handleId;
    }
    override onBlur(event: FocusEvent) {
        this.currentHandle = null;
        super.onBlur(event);
    }
}
