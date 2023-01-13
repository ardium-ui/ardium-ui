import { Directive, HostBinding, Input } from "@angular/core";
import { coerceBooleanProperty } from '../../../../devkit/src/public-api';


@Directive()
export abstract class _DisablableComponent {
    //* no value arguments
    protected _readonly: boolean = false;
    @Input()
    @HostBinding('attr.readonly')
    @HostBinding('class.ard-readonly')
    get readonly(): boolean { return this._readonly };
    set readonly(v: any) { this._readonly = coerceBooleanProperty(v); }

    protected _disabled: boolean = false;
    @Input()
    @HostBinding('attr.disabled')
    @HostBinding('class.ard-disabled')
    get disabled(): boolean { return this.readonly || this._disabled };
    set disabled(v: any) { this._disabled = coerceBooleanProperty(v); }
}