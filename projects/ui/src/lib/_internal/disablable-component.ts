import { Directive, HostBinding, Input, input, signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Directive()
export abstract class _DisablableComponentBase {
  //! no value arguments
  /**
   * Whether the component is read-only. Defines the `readonly` host attribute and `ard-readonly` host class. Coearcible into a boolean.
   */
  readonly readonly = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

  /**
   * Whether the component is disabled. Defines the `disabled` host attribute and `ard-disabled` host class. Coearcible into a boolean.
   */
  readonly disabled = signal<boolean>(false);
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
