import { InjectionToken, Provider } from '@angular/core';
import { _focusableComponentDefaults, _FocusableComponentDefaults } from '../../_internal/focusable-component';
import { _chipDefaults, ArdChipDefaults } from '../chip.defaults';

export interface ArdDeletableChipDefaults extends ArdChipDefaults, _FocusableComponentDefaults {
  deleteButtonTitle: string;
}

const _deletableChipDefaults: ArdDeletableChipDefaults = {
  ..._focusableComponentDefaults,
  ..._chipDefaults,
  deleteButtonTitle: 'Delete',
};

export const ARD_DELETABLE_CHIP_DEFAULTS = new InjectionToken<ArdDeletableChipDefaults>('ard-deletable-chip-defaults', {
  factory: () => ({
    ..._deletableChipDefaults,
  }),
});

export function provideDeletableChipDefaults(config: Partial<ArdDeletableChipDefaults>): Provider {
  return { provide: ARD_DELETABLE_CHIP_DEFAULTS, useValue: { ..._deletableChipDefaults, ...config } };
}
