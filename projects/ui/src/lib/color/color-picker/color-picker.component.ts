import { ChangeDetectionStrategy, Component, ViewEncapsulation, Input, Output, EventEmitter, ContentChild, TemplateRef, HostListener, ViewChild } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty, getDomPaddingRect, getEventRelativePos } from '@ardium-ui/devkit';
import * as Color from 'color';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { ArdColorPickerShadeIndicatorTemplateDirective, ArdColorPickerHueIndicatorTemplateDirective, ArdColorPickerColorWindowTemplateDirective } from './color-picker.directives';
import { ColorPickerColorWindowContext, ColorPickerIndicatorContext, ColorPickerVariant } from './color-picker.types';
import { ElementRef } from '@angular/core';

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
    set withOpacity(v: any) { this._withOpacity = coerceBooleanProperty(v); }

    private _referenceColor: Color = Color("transparent");
    @Input()
    set referenceColor(v: any) {
        this._referenceColor = Color(v);
    }
    get referenceColor(): Color { return this._referenceColor; }

    //! appearance
    @Input() wrapperClasses: string = '';

    @Input() variant: ColorPickerVariant = ColorPickerVariant.Rounded;

    private _vertical: boolean = false;
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

    @Output() valueChange = new EventEmitter<Color>();

    @Input()
    set opacity(v: any) {
        const opacity = coerceNumberProperty(v, 1);
        this.value.alpha(opacity);
    }
    get opacity(): number { return this.value.alpha(); }

    @Output() opacityChange = new EventEmitter<Color>();

    @Input()
    set hue(v: any) {
        const hue = coerceNumberProperty(v, 0);
        this.value.hue(hue);
    }
    get hue(): number { return this.value.hue(); }

    @Output() hueChange = new EventEmitter<Color>();

    writeValue(v: any) {
        this._value = Color(v);
    }

    //! creating new value from interactions
    @ViewChild('shadeMap', { read: ElementRef }) shadeMapEl!: ElementRef<HTMLDivElement>;
    @ViewChild('hueMap', { read: ElementRef }) hueMapEl!: ElementRef<HTMLDivElement>;

    private _focusedArea: 'shade' | 'hue' | null = null;

    onShadeAreaMouseDown(event: MouseEvent): void {
        this._focusedArea = 'shade';
        this._updateShadeFromEvent(event);
    }
    onHueAreaMouseDown(event: MouseEvent): void {
        this._focusedArea = 'hue';
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

        this._updateHueFromEvent(event);
    }

    private _updateShadeFromEvent(event: MouseEvent | TouchEvent): void {
        const { left, right, top, bottom } = getEventRelativePos(event, this.shadeMapEl);

        const shadeMapWidth = left + right;
        const xPosPercent = left / shadeMapWidth * 100;
        const xPos = Math.max(0, Math.min(100, xPosPercent));

        const shadeMapHeight = top + bottom;
        const yPosPercent = bottom / shadeMapHeight * 100;
        const yPos = Math.max(0, Math.min(100, yPosPercent));

        this.value = Color.hsv(this.value.hue(), xPos, yPos);

        this._emitChange();
    }
    private _updateHueFromEvent(event: MouseEvent | TouchEvent): void {
        const { top, bottom } = getEventRelativePos(event, this.hueMapEl);

        const hueMapHeight = top + bottom;
        const newHueRaw = top / hueMapHeight * 360;
        const newHue = Math.max(0, Math.min(359, newHueRaw));

        this.value = Color.hsv(newHue, this.value.saturationv(), this.value.value());

        this._emitChange();
        this._updateCurrentShadeMapColor();
    }

    //! displaying the maps correctly
    currentShadeMapColor: Color = this.value;

    private _updateCurrentShadeMapColor(): void {
        this.currentShadeMapColor = Color.hsv(this.value.hue(), 100, 100);
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

    //! events
    private _emitChange() {
        const v = this.value;
        this._onChangeRegistered?.(v);
        this.valueChange.next(v);
    }

    //! template customization
    @ContentChild(ArdColorPickerShadeIndicatorTemplateDirective, { read: TemplateRef }) shadeIndicatorTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorPickerHueIndicatorTemplateDirective, { read: TemplateRef }) hueIndicatorTemplate?: TemplateRef<any>;
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
