import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { SimpleComponentColor } from '../types/colors.types';
import { ArdProgressCircleValueTemplateDirective } from './progress-circle.directive';
import { ProgressCircleAppearance, ProgressCircleValueContext, ProgressCircleVariant } from './progress-circle.types';

@Component({
    selector: 'ard-progress-circle',
    templateUrl: './progress-circle.component.html',
    styleUrls: ['./progress-circle.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumProgressCircleComponent {
    private _value: number = 0;
    @Input()
    get value(): number {
        return this._value;
    }
    set value(v: any) {
        this._value = coerceNumberProperty(v, 0);
    }

    private _max: number = 100;
    @Input()
    get max(): number {
        return this._max;
    }
    set max(v: any) {
        this._max = coerceNumberProperty(v, 100);
    }

    get percentValue(): number {
        return (this.value / this.max) * 100;
    }

    //! appearance
    @Input() appearance: ProgressCircleAppearance = ProgressCircleAppearance.Transparent;
    @Input() variant: ProgressCircleVariant = ProgressCircleVariant.Full;
    @Input() color: SimpleComponentColor = SimpleComponentColor.Primary;

    private _hideValue: boolean = false;
    @Input()
    get hideValue(): boolean {
        return this._hideValue;
    }
    set hideValue(v: any) {
        this._hideValue = coerceBooleanProperty(v);
    }

    private _reverse: boolean = false;
    @Input()
    get reverse(): boolean {
        return this._reverse;
    }
    set reverse(v: any) {
        this._reverse = coerceBooleanProperty(v);
    }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-progress-circle-variant-${this.variant}`,
            `ard-color-${this.color}`,
            this.hideValue ? 'ard-progress-circle-hide-value' : '',
            this.reverse ? 'ard-progress-circle-reversed' : '',
        ].join(' ');
    }

    get fillPercentVariable(): string {
        const fillAmount = this.reverse ? 100 - this.percentValue : this.percentValue;
        return `--ard-_progress-circle-fill-amount: ${fillAmount}%`;
    }

    //! templates
    @ContentChild(ArdProgressCircleValueTemplateDirective, {
        read: TemplateRef,
    })
    valueTemplate?: TemplateRef<any>;

    getValueContext(): ProgressCircleValueContext {
        const percentValue = Math.round(this.percentValue);
        return {
            value: this.value,
            percentValue,
            max: this.max,
            $implicit: percentValue,
        };
    }
}
