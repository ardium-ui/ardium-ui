import { computed, Directive, Inject, input } from '@angular/core';
import { BooleanLike, coerceBooleanProperty } from '@ardium-ui/devkit';
import { _ButtonBase } from '../_button-base';
import { ButtonVariant } from '../general-button.types';
import { ARD_BUTTON_DEFAULTS, ArdButtonDefaults } from './button.defaults';

@Directive({
  selector: 'button[ard-button], a[ard-button]',
  standalone: false,
  host: {
    '[class]': 'ngClasses()',
    '[type]': 'type()',
    '[tabindex]': 'tabIndex()',
    '(focus)': 'onFocus($event)',
    '(blur)': 'onBlur($event)',
  },
})
export class ArdiumButtonDirective extends _ButtonBase {
  protected override readonly _DEFAULTS!: ArdButtonDefaults;

  constructor(@Inject(ARD_BUTTON_DEFAULTS) defaults: ArdButtonDefaults) {
    super(defaults);
  }

  //! button settings
  readonly variant = input<ButtonVariant>(this._DEFAULTS.variant);

  readonly vertical = input<boolean, BooleanLike>(this._DEFAULTS.vertical, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      'ard-button',
      this.wrapperClasses(),
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-color-${this.color()}`,
      this.lightColoring() ? `ard-light-coloring` : '',
      this.compact() ? 'ard-compact' : '',
      this.vertical() ? 'ard-button-vertical' : '',
      this.pointerEventsWhenDisabled() ? 'ard-button-with-pointer-events-when-disabled' : '',
    ].join(' ')
  );
}
