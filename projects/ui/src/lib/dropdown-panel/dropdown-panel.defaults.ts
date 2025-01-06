import { InjectionToken, Provider } from '@angular/core';
import { DropdownPanelAppearance, DropdownPanelVariant } from './dropdown-panel.types';

export interface ArdDropdownPanelDefaults {
  filterValue: string;
  appearance: DropdownPanelAppearance;
  variant: DropdownPanelVariant;
  compact: boolean;
}

const _dropdownPanelDefaults: ArdDropdownPanelDefaults = {
  filterValue: '',
  appearance: DropdownPanelAppearance.Raised,
  variant: DropdownPanelVariant.Rounded,
  compact: false,
};

export const ARD_DROPDOWN_PANEL_DEFAULTS = new InjectionToken<ArdDropdownPanelDefaults>('ard-dropdown-panel-defaults', {
  factory: () => ({
    ..._dropdownPanelDefaults,
  }),
});

export function provideDropdownPanelDefaults(config: Partial<ArdDropdownPanelDefaults>): Provider {
  return { provide: ARD_DROPDOWN_PANEL_DEFAULTS, useValue: { ..._dropdownPanelDefaults, ...config } };
}
