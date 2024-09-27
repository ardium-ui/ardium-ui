import { InjectionToken } from '@angular/core';
import { _booleanComponentDefaults, _BooleanComponentDefaults } from '../../_internal/boolean-component';
import { _chipDefaults, ArdChipDefaults } from '../chip.defaults';

export interface ArdSelectableChipDefaults extends ArdChipDefaults, _BooleanComponentDefaults {
  chipTitle: string;
  hideSelectionIcon: boolean;
}

export const ARD_SELECTABLE_CHIP_DEFAULTS = new InjectionToken<ArdSelectableChipDefaults>('ard-selectable-chip-defaults', {
  factory: () => ({
    ..._booleanComponentDefaults,
    ..._chipDefaults,
    chipTitle: 'Select',
    hideSelectionIcon: false,
  }),
});
