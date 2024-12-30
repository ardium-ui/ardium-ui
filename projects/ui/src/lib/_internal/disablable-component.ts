import { Directive, HostBinding, Input, input, signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

export interface _DisablableComponentDefaults {
  readonly: boolean;
  disabled: boolean;
}
export const _disablableComponentDefaults: _DisablableComponentDefaults = {
  readonly: false,
  disabled: false,
};

@Directive()
export abstract class _DisablableComponentBaseWithDefaults {
  constructor(protected readonly _DEFAULTS: _DisablableComponentDefaults) {}
  //! no value arguments
  /**
   * Whether the component is read-only. Defines the `readonly` host attribute and `ard-readonly` host class. Coercible into a boolean.
   */
  readonly readonly = input<any, boolean>(this._DEFAULTS.readonly, { transform: v => coerceBooleanProperty(v) });

  /**
   * Whether the component is disabled. Defines the `disabled` host attribute and `ard-disabled` host class. Coercible into a boolean.
   */
  readonly disabled = signal<boolean>(this._DEFAULTS.disabled);
  @Input('disabled')
  set _disabled(v: any) {
    this.disabled.set(coerceBooleanProperty(v));
  }

  @HostBinding('attr.readonly')
  @HostBinding('class.ard-readonly')
  get _readonlyHostAttribute(): boolean {
    return this.readonly();
  }
  @HostBinding('attr.disabled')
  @HostBinding('class.ard-disabled')
  get _disabledHostAttribute(): boolean {
    return this.disabled();
  }
}
