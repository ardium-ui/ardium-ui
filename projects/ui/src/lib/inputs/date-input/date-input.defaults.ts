import { InjectionToken, Provider } from '@angular/core';
import { _FormFieldComponentDefaults, _formFieldComponentDefaults } from '../../_internal/form-field-component';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel';
import { ComponentColor } from '../../types/colors.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { DEFAULT_DATE_INPUT_DESERIALIZE_FN, DEFAULT_DATE_INPUT_SERIALIZE_FN } from './date-input.serializers';
import { ArdDateInputDeserializeFn, ArdDateInputSerializeFn } from './date-input.types';

export interface ArdDateInputDefaults extends _FormFieldComponentDefaults {
  inputAttrs: Record<string, any>;
  placeholder: string;
  serializeFn: ArdDateInputSerializeFn;
  deserializeFn: ArdDateInputDeserializeFn;
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  color: ComponentColor;
  compact: boolean;
  dropdownAppearance: DropdownPanelAppearance;
  dropdownVariant: DropdownPanelVariant;
}

const _dateInputDefaults: ArdDateInputDefaults = {
  ..._formFieldComponentDefaults,
  inputAttrs: {},
  placeholder: 'DD/MM/YYYY',
  serializeFn: DEFAULT_DATE_INPUT_SERIALIZE_FN,
  deserializeFn: DEFAULT_DATE_INPUT_DESERIALIZE_FN,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  color: ComponentColor.Primary,
  compact: false,
  dropdownAppearance: DropdownPanelAppearance.Outlined,
  dropdownVariant: DropdownPanelVariant.Rounded,
};

export const ARD_DATE_INPUT_DEFAULTS = new InjectionToken<ArdDateInputDefaults>('ard-date-input-defaults', {
  factory: () => ({ ..._dateInputDefaults }),
});

export function provideDateInputDefaults(config: Partial<ArdDateInputDefaults>): Provider {
  return { provide: ARD_DATE_INPUT_DEFAULTS, useValue: { ..._dateInputDefaults, ...config } };
}
