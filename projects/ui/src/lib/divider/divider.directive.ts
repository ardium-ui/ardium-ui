import { computed, Directive, inject, input } from '@angular/core';
import { BooleanLike, coerceBooleanProperty } from '@ardium-ui/devkit';
import { OneAxisAlignmentOrientational } from '../types/alignment.types';
import { ARD_DIVIDER_DEFAULTS } from './divider.defaults';
import { ArdDividerVariant } from './divider.types';

@Directive({
  selector: '[ard-divider]',
  standalone: false,
  host: {
    role: 'separator',
    '[class]': 'ngClasses()',
  },
})
export class ArdiumDividerDirective {
  protected readonly _DEFAULTS = inject(ARD_DIVIDER_DEFAULTS);

  readonly vertical = input<boolean, BooleanLike>(this._DEFAULTS.vertical, { transform: v => coerceBooleanProperty(v) });

  readonly flexItem = input<boolean, BooleanLike>(false, { transform: v => coerceBooleanProperty(v) });

  readonly textAlign = input<OneAxisAlignmentOrientational>(OneAxisAlignmentOrientational.Center);

  readonly variant = input<ArdDividerVariant>(ArdDividerVariant.Full);

  readonly ngClasses = computed<string>(() =>
    [
      'ard-divider',
      this.vertical() ? 'ard-divider__vertical' : 'ard-divider__horizontal',
      this.flexItem() ? 'ard-divider__flex-item' : '',
      `ard-divider__text-align-${this.textAlign()}`,
      `ard-divider__${this.variant()}`,
    ].join(' ')
  );
}
