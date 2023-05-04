import { ChangeDetectionStrategy, Component, ViewEncapsulation, Input, Output, EventEmitter, ContentChild, TemplateRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty, getDomPaddingRect, getEventRelativePos } from '@ardium-ui/devkit';
import * as Color from 'color';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { ArdColorPickerShadeIndicatorTemplateDirective, ArdColorPickerHueIndicatorTemplateDirective, ArdColorPickerColorWindowTemplateDirective, ArdColorPickerOpacityIndicatorTemplateDirective } from './color-picker.directives';
import { ColorPickerColorWindowContext, ColorPickerIndicatorContext, ColorPickerVariant } from './color-picker.types';
import { ElementRef } from '@angular/core';
import { round, roundToPrecision } from 'more-rounding';

@Component({
    selector: 'ard-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumColorPickerComponent extends _NgModelComponentBase {

    private _withOpacity: boolean = false;
    @Input()
    get withOpacity(): boolean { return this._withOpacity; }
    set withOpacity(v: any) {
        this._withOpacity = coerceBooleanProperty(v);

        if (this._focusedArea == 'opacity') this._focusedArea = null;
    }

    private _referenceColor: Color = Color("transparent");
    @Input()
    set referenceColor(v: any) {
        this._referenceColor = Color(v);
    }
    get referenceColor(): Color { return this._referenceColor; }

    //! appearance
    @Input() wrapperClasses: string = '';

    @Input() variant: ColorPickerVariant = ColorPickerVariant.Rounded;

    private _vertical: boolean = false; //TODO implement in CSS
    @Input()
    get vertical(): boolean { return this._vertical; }
    set vertical(v: any) { this._vertical = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            this.wrapperClasses,
            `ard-variant-${this.variant}`,
            this.vertical ? 'ard-vertical' : '',
        ].join(' ');
    }

    //! value-related
    private _value: Color = Color("red");
    @Input()
    set value(v: any) {
        this.writeValue(v);
    }
    get value(): Color { return this._value; }

    @Input()
    set colorHue(v: any) {
        const hue = coerceNumberProperty(v, 0);
        this.value.hue(hue);
    }
    get colorHue(): number { return this.value.hue(); }

    @Input()
    set colorSaturation(v: any) {
        const saturation = coerceNumberProperty(v, 100);
        this.value.saturationl(saturation);
    }
    get colorSaturation(): number { return this.value.saturationl(); }

    @Input()
    set colorValue(v: any) {
        const value = coerceNumberProperty(v, 100);
        this.value.value(value);
    }
    get colorValue(): number { return this.value.value(); }

    @Input()
    set colorOpacity(v: any) {
        const opacity = coerceNumberProperty(v, 1);
        this.value.alpha(opacity);
    }
    get colorOpacity(): number { return this.value.alpha(); }

    @Output() valueChange = new EventEmitter<Color>();
    @Output() colorHueChange = new EventEmitter<number>();
    @Output() colorSaturationChange = new EventEmitter<number>();
    @Output() colorValueChange = new EventEmitter<number>();
    @Output() colorOpacityChange = new EventEmitter<number>();

    writeValue(v: any) {
        this._value = Color(v);
    }

    //! creating new value from interactions
    @ViewChild('shadeMap', { read: ElementRef }) shadeMapEl!: ElementRef<HTMLDivElement>;
    @ViewChild('hueMap', { read: ElementRef }) hueMapEl!: ElementRef<HTMLDivElement>;
    @ViewChild('opacityMap', { read: ElementRef }) opacityMapEl!: ElementRef<HTMLDivElement>;

    private _focusedArea: 'shade' | 'hue' | 'opacity' | null = null;

    onShadeAreaMouseDown(event: MouseEvent): void {
        this._focusedArea = 'shade';
        this._updateShadeFromEvent(event);
    }
    onHueAreaMouseDown(event: MouseEvent): void {
        this._focusedArea = 'hue';
    }
    onOpacityAreaMouseDown(event: MouseEvent): void {
        this._focusedArea = 'opacity';
    }

    @HostListener('document:pointerup')
    @HostListener('document:touchend')
    onDocumentMouseUp(): void {
        this._focusedArea = null;
    }

    @HostListener('document:pointermove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onDocumentMousemove(event: MouseEvent | TouchEvent): void {
        if (!this._focusedArea) return;

        if (!(event instanceof TouchEvent)) event.preventDefault();

        if (this._focusedArea == 'shade') {
            this._updateShadeFromEvent(event);
            return;
        }
        if (this._focusedArea == 'hue') {
            this._updateHueFromEvent(event);
            return;
        }
        this._updateOpacityFromEvent(event);
    }

    private _updateShadeFromEvent(event: MouseEvent | TouchEvent): void {
        const { left, right, top, bottom } = getEventRelativePos(event, this.shadeMapEl);

        const shadeMapWidth = left + right;
        const newSaturationRaw = left / shadeMapWidth * 100;
        const newSaturation = round(Math.max(0, Math.min(100, newSaturationRaw)));

        const shadeMapHeight = top + bottom;
        const newValueRaw = bottom / shadeMapHeight * 100;
        const newValue = round(Math.max(0, Math.min(100, newValueRaw)));

        const oldSaturation = this.value.saturationv();
        const oldValue = this.value.value();

        if (oldSaturation == newSaturation && oldValue == newValue) return;

        this.value = Color(this.value).saturationv(newSaturation).value(newValue);

        this._emitChange();
        this._updateCurrentOpacityMapColor();
        //emit specific events
        if (oldSaturation != this.value.saturationv()) this.colorSaturationChange.next(this.value.saturationv());
        if (oldValue != this.value.value()) this.colorValueChange.next(this.value.value());
    }
    private _updateHueFromEvent(event: MouseEvent | TouchEvent): void {
        const { top, bottom } = getEventRelativePos(event, this.hueMapEl);

        const hueMapHeight = top + bottom;
        const newHueRaw = top / hueMapHeight * 360;
        const newHue = round(Math.max(0, Math.min(359, newHueRaw)));

        if (this.value.hue() == newHue) return;

        this.value = Color(this.value).hue(newHue);

        this._emitChange();
        this.colorHueChange.next(this.value.hue());
        this._updateCurrentShadeMapColor();
        this._updateCurrentOpacityMapColor();
    }
    private _updateOpacityFromEvent(event: MouseEvent | TouchEvent): void {
        if (!this.withOpacity) return;
        
        const { top, bottom } = getEventRelativePos(event, this.opacityMapEl);

        const hueMapHeight = top + bottom;
        const newOpacityRaw = bottom / hueMapHeight;
        const newOpacity = roundToPrecision(Math.max(0, Math.min(1, newOpacityRaw)), 2);

        if (this.value.alpha() == newOpacity) return;

        this.value = Color(this.value).alpha(newOpacity);

        this._emitChange();
        this.colorOpacityChange.next(this.value.alpha());
    }

    //! displaying the maps correctly
    currentShadeMapColor: Color = this.value;
    private _updateCurrentShadeMapColor(): void {
        this.currentShadeMapColor = Color.hsv(this.value.hue(), 100, 100);
    }
    currentOpacityMapColor: Color = this.value;
    private _updateCurrentOpacityMapColor(): void {
        this.currentOpacityMapColor = Color.hsv(this.value.hue(), this.value.saturationv(), this.value.value());
    }

    getShadeIndicatorPosition(): { '--top': string, '--left': string } {
        return {
            '--top': 100 - this.value.value() + '%',
            '--left': this.value.saturationv() + '%',
        };
    }
    getHueIndicatorPosition(): { '--top': string } {
        return {
            '--top': this.value.hue() / 3.6 + '%',
        };
    }
    getOpacityIndicatorPosition(): { '--top': string } {
        return {
            '--top': 100 - this.value.alpha() * 100 + '%',
        };
    }

    //! events
    private _emitChange() {
        const v = this.value;
        this._onChangeRegistered?.(v);
        this.valueChange.next(v);
    }

    //! template customization
    @ContentChild(ArdColorPickerShadeIndicatorTemplateDirective, { read: TemplateRef }) shadeIndicatorTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorPickerHueIndicatorTemplateDirective, { read: TemplateRef }) hueIndicatorTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorPickerOpacityIndicatorTemplateDirective, { read: TemplateRef }) opacityIndicatorTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorPickerColorWindowTemplateDirective, { read: TemplateRef }) colorWindowTemplate?: TemplateRef<any>;

    getIndicatorContext(): ColorPickerIndicatorContext {
        return {
            $implicit: this.value,
        };
    }
    getColorWindowContext(): ColorPickerColorWindowContext {
        return {
            color: this.value,
            $implicit: this.value,
            referenceColor: this.referenceColor,
        };
    }
}
