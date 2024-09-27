import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../types/alignment.types';
import { ComponentColor } from '../types/colors.types';
import { DecorationElementAppearance, FormElementVariant } from '../types/theming.types';
import { _DisablableComponentBase } from './../_internal/disablable-component';
import { ARD_CHIP_DEFAULTS } from './chip.defaults';

@Component({
  selector: 'ard-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumChipComponent extends _DisablableComponentBase {
  protected override readonly _DEFAULTS = inject(ARD_CHIP_DEFAULTS);

  //! appearance
  readonly contentAlignment = input<SimpleOneAxisAlignment>(this._DEFAULTS.contentAlignment);
  readonly appearance = input<DecorationElementAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<FormElementVariant>(this._DEFAULTS.variant);
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly wrapperClasses = input<string>('');

  readonly ngClasses = computed(() =>
    [
      this.wrapperClasses(),
      `ard-chip-align-${this.contentAlignment()}`,
      `ard-variant-${this.variant()}`,
      `ard-appearance-${this.appearance()}`,
      `ard-color-${this.color()}`,
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );
}
