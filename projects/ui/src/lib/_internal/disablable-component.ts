import { Directive, HostBinding, Input, input, signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Directive()
export abstract class _DisablableComponentBase {
  //! no value arguments
  @HostBinding('attr.readonly')
  @HostBinding('class.ard-readonly')
  /**
   * Whether the component is read-only. Defines the `readonly` host attribute and `ard-readonly` host class. Coearcible into a boolean.
   */
  readonly readonly = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  @HostBinding('attr.disabled')
  @HostBinding('class.ard-disabled')
  /**
   * Whether the component is disabled. Defines the `disabled` host attribute and `ard-disabled` host class. Coearcible into a boolean.
   */
  readonly disabled = signal<boolean>(false);
  @Input('disabled')
  set _disabled(v: any) {
    this.disabled.set(coerceBooleanProperty(v));
  }
}
