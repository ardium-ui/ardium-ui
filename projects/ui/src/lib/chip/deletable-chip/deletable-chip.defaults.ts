import { InjectionToken } from '@angular/core';
import { _focusableComponentDefaults, _FocusableComponentDefaults } from '../../_internal/focusable-component';
import { _chipDefaults, ArdChipDefaults } from '../chip.defaults';

export interface ArdDeletableChipDefaults extends ArdChipDefaults, _FocusableComponentDefaults {
  deleteButtonTitle: string;
}

export const ARD_DELETABLE_CHIP_DEFAULTS = new InjectionToken<ArdDeletableChipDefaults>('ard-deletable-chip-defaults', {
  factory: () => ({
    ..._focusableComponentDefaults,
    ..._chipDefaults,
    deleteButtonTitle: 'Delete',
  }),
});
