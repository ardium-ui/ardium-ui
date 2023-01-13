import { ChangeDetectionStrategy, Component, forwardRef, HostListener, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { roundToPrecision } from 'more-rounding';
import { _AbstractSlider } from './abstract-slider';

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
            multi: true
        }
    ]
})
export class ArdiumSliderComponent extends _AbstractSlider<number> {

    //* value input & output
    protected _value: number = 0;

    //* writeValue
    writeValue(v: any): void {
        v = Number(v);
        if (isNaN(v)) {
            this.reset()
            return;
        }
        v = this._clampValue(v);
        this._value = v;
        this._positionPercent[0] = this._valueToPercent(v);
    }
    
    //* methods for programmatic manipulation
    reset(): void {
        this._value = 0;
        this._positionPercent[0] = 0;
    }
    increment(steps: number = 1): void {
        this._setToNextStep(steps, false);
    }
    decrement(steps: number = 1): void {
        this._setToNextStep(-steps, false);
    }

    //* event handlers
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
        this._writeValueFromEvent(event);
    }

    //* position calculators
    protected _percentValueToValue(percent: number): number {
        const minMaxDifference = Math.abs(this._min - this._max);
        const newVal = percent * minMaxDifference + this._min;
        return roundToPrecision(newVal, 12); //round to 12 decimal places to avoid floating point arithmetic errors
    }
}
