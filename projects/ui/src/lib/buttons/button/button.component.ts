import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, computed, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { _ButtonBaseWithDefaults } from '../_button-base';
import { ButtonVariant } from '../general-button.types';
import { ARD_BUTTON_DEFAULTS, ArdButtonDefaults } from './button.defaults';

@Component({
  selector: 'ard-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumButtonComponent extends _ButtonBaseWithDefaults {
  protected override readonly _DEFAULTS!: ArdButtonDefaults;

  readonly icon = input<string>('');

  constructor(@Inject(ARD_BUTTON_DEFAULTS) defaults: ArdButtonDefaults) {
    super(defaults);
  }

  //! button settings
  readonly variant = input<ButtonVariant>(this._DEFAULTS.variant);
  readonly alignIcon = input<SimpleOneAxisAlignment>(this._DEFAULTS.alignIcon);

  readonly vertical = input<boolean, any>(this._DEFAULTS.vertical, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      this.wrapperClasses(),
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-color-${this.color()}`,
      `ard-align-${this.alignIcon()}`,
      this.lightColoring() ? `ard-light-coloring` : '',
      this.compact() ? 'ard-compact' : '',
      this.vertical() ? 'ard-button-vertical' : '',
    ].join(' ')
  );
}
