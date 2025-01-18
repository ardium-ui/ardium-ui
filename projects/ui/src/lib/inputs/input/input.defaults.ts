import { InjectionToken, Provider } from '@angular/core';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel/dropdown-panel.types';
import { Nullable } from '../../types/utility.types';
import { _SimpleInputComponentDefaults, _simpleInputComponentDefaults } from '../_simple-input-base';

export interface ArdInputDefaults extends _SimpleInputComponentDefaults {
  suggValueFrom: string;
  suggLabelFrom: string;
  suggestionsLoadingText: string;
  charlist: string | undefined;
  charlistCaseInsensitive: boolean;
  dropdownAppearance: Nullable<DropdownPanelAppearance>;
  dropdownVariant: Nullable<DropdownPanelVariant>;
}

const _inputDefaults: ArdInputDefaults = {
  ..._simpleInputComponentDefaults,
  suggValueFrom: 'value',
  suggLabelFrom: 'label',
  suggestionsLoadingText: 'Loading...',
  charlist: undefined,
  charlistCaseInsensitive: false,
  dropdownAppearance: undefined,
  dropdownVariant: undefined,
};

export const ARD_INPUT_DEFAULTS = new InjectionToken<ArdInputDefaults>('ard-input-defaults', {
  factory: () => ({
    ..._inputDefaults,
  }),
});

export function provideInputDefaults(config: Partial<ArdInputDefaults>): Provider {
  return { provide: ARD_INPUT_DEFAULTS, useValue: { ..._inputDefaults, ...config } };
}
