import { InjectionToken, Provider } from '@angular/core';
import { _booleanComponentDefaults, _BooleanComponentDefaults } from '../../_internal/boolean-component';
import { _chipDefaults, ArdChipDefaults } from '../chip.defaults';

export interface ArdSelectableChipDefaults extends ArdChipDefaults, _BooleanComponentDefaults {
  chipTitle: string;
  hideSelectionIcon: boolean;
}

const _selectableChipDefaults = {
    ..._booleanComponentDefaults,
    ..._chipDefaults,
    chipTitle: 'Select',
    hideSelectionIcon: false,
};

export const ARD_SELECTABLE_CHIP_DEFAULTS = new InjectionToken<ArdSelectableChipDefaults>('ard-selectable-chip-defaults', {
  factory: () => ({
    ..._selectableChipDefaults,
  }),
});

export function provideSelectableChipDefaults(config: Partial<ArdSelectableChipDefaults>): Provider {
  return { provide: ARD_SELECTABLE_CHIP_DEFAULTS, useValue: { ..._selectableChipDefaults, ...config } };
}
