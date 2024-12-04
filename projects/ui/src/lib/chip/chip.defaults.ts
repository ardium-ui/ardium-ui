import { InjectionToken, Provider } from '@angular/core';
import { _disablableComponentDefaults, _DisablableComponentDefaults } from '../_internal/disablable-component';
import { SimpleOneAxisAlignment } from '../types/alignment.types';
import { ComponentColor } from '../types/colors.types';
import { DecorationElementAppearance, FormElementVariant } from '../types/theming.types';

export interface ArdChipDefaults extends _DisablableComponentDefaults {
  contentAlignment: SimpleOneAxisAlignment;
  appearance: DecorationElementAppearance;
  variant: FormElementVariant;
  color: ComponentColor;
  compact: boolean;
}

export const _chipDefaults: ArdChipDefaults = {
  ..._disablableComponentDefaults,
  contentAlignment: SimpleOneAxisAlignment.Left,
  appearance: DecorationElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  color: ComponentColor.Primary,
  compact: false,
};

export const ARD_CHIP_DEFAULTS = new InjectionToken<ArdChipDefaults>('ard-chip-defaults', {
  factory: () => _chipDefaults,
});

export function provideChipDefaults(config: Partial<ArdChipDefaults>): Provider {
  return { provide: ARD_CHIP_DEFAULTS, useValue: { ..._chipDefaults, ...config } };
}
