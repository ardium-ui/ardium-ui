import { Directive, HostBinding, Input } from "@angular/core";
import { coerceBooleanProperty } from '../../../../devkit/src/public-api';


@Directive()
export abstract class _DisablableComponentBase {
    //! no value arguments
    protected _readonly: boolean = false;
    @Input()
    @HostBinding('attr.readonly')
    @HostBinding('class.ard-readonly')
    /**
     * Whether the component is read-only. Defines the `readonly` host attribute and `ard-readonly` host class. Coearcible into a boolean.
     */
    get readonly(): boolean { return this._readonly };
    set readonly(v: any) { this._readonly = coerceBooleanProperty(v); }

    protected _disabled: boolean = false;
    @Input()
    @HostBinding('attr.disabled')
    @HostBinding('class.ard-disabled')
    /**
     * Whether the component is disabled. Defines the `disabled` host attribute and `ard-disabled` host class. Coearcible into a boolean.
     */
    get disabled(): boolean { return this.readonly || this._disabled };
    set disabled(v: any) { this._disabled = coerceBooleanProperty(v); }
}