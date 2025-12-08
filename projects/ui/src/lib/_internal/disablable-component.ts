import { computed, Directive, HostBinding, input, signal } from '@angular/core';
import { FormUiControl } from '@angular/forms/signals';
import { BooleanLike, coerceBooleanProperty } from '@ardium-ui/devkit';

export interface _DisablableComponentDefaults {
  readonly: boolean;
  disabled: boolean;
}
export const _disablableComponentDefaults: _DisablableComponentDefaults = {
  readonly: false,
  disabled: false,
};

@Directive()
export abstract class _DisablableComponentBase implements Pick<FormUiControl, 'disabled' | 'readonly'> {
  constructor(protected readonly _DEFAULTS: _DisablableComponentDefaults) {}
  //! no value arguments
  /**
   * Whether the component is read-only. Defines the `readonly` host attribute and `ard-readonly` host class. Coercible into a boolean.
   */
  readonly readonly = input<boolean, BooleanLike>(this._DEFAULTS.readonly, { transform: v => coerceBooleanProperty(v) });

  /**
   * Whether the component is disabled. Defines the `disabled` host attribute and `ard-disabled` host class. Coercible into a boolean.
   */
  readonly disabled = input<boolean, BooleanLike>(this._DEFAULTS.disabled, { transform: v => coerceBooleanProperty(v) });

  readonly disabledComputed = computed<boolean>(() => this.disabled() || this.disabledManual());

  readonly disabledManual = signal<boolean>(false);

  @HostBinding('attr.readonly')
  @HostBinding('class.ard-readonly')
  get _readonlyHostAttribute(): boolean {
    return this.readonly();
  }
  @HostBinding('attr.disabled')
  @HostBinding('class.ard-disabled')
  get _disabledHostAttribute(): boolean {
    return this.disabledComputed();
  }
}