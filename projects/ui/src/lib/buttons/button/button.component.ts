import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, computed, input } from '@angular/core';
import { BooleanLike, coerceBooleanProperty } from '@ardium-ui/devkit';
import { _ButtonBase } from '../_button-base';
import { ButtonVariant } from '../general-button.types';
import { ARD_BUTTON_DEFAULTS, ArdButtonDefaults } from './button.defaults';

@Component({
  standalone: false,
  selector: 'ard-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ard-button-with-pointer-events-when-disabled]': 'pointerEventsWhenDisabled()',
  },
})
export class ArdiumButtonComponent extends _ButtonBase {
  protected override readonly _DEFAULTS!: ArdButtonDefaults;

  constructor(@Inject(ARD_BUTTON_DEFAULTS) defaults: ArdButtonDefaults) {
    super(defaults);
  }

  //! button settings
  readonly variant = input<ButtonVariant>(this._DEFAULTS.variant);

  readonly vertical = input<boolean, BooleanLike>(this._DEFAULTS.vertical, { transform: v => coerceBooleanProperty(v) });

  // stub definition to satisfy abstract class
  override readonly ngClasses = computed(() => '');
}
