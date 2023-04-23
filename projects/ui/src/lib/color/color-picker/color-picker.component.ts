import { ChangeDetectionStrategy, Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import * as Color from 'color';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';

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

    //! events
    private _emitChange() {
        const v = this.value;
        this._onChangeRegistered?.(v);
        this.valueChange.next(v);
    }
}
