import { InjectionToken, Provider } from '@angular/core';
import { _FormFieldComponentDefaults, _formFieldComponentDefaults } from '../../_internal/form-field-component';
import { ArdCalendarFilterFn, ArdCalendarView } from '../../calendar/calendar.types';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel';
import { ComponentColor } from '../../types/colors.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { DEFAULT_DATE_INPUT_DESERIALIZE_FN, DEFAULT_DATE_INPUT_SERIALIZE_FN } from './date-input.serializers';
import { ArdDateInputDeserializeFn, ArdDateInputMinMaxStrategy, ArdDateInputSerializeFn } from './date-input.types';

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
  minMaxStrategy: ArdDateInputMinMaxStrategy;
  // calendar defaults
  activeView: ArdCalendarView;
  activeYear: number;
  activeMonth: number;
  firstWeekday: number;
  multipleYearPageChangeModifier: number;
  min: Date | null;
  max: Date | null;
  filter: ArdCalendarFilterFn | null;
  UTC: boolean;
}

const _dateInputDefaults: ArdDateInputDefaults = {
  ..._formFieldComponentDefaults,
  inputAttrs: {},
  placeholder: 'Choose a date',
  serializeFn: DEFAULT_DATE_INPUT_SERIALIZE_FN,
  deserializeFn: DEFAULT_DATE_INPUT_DESERIALIZE_FN,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  color: ComponentColor.Primary,
  compact: false,
  dropdownAppearance: DropdownPanelAppearance.Outlined,
  dropdownVariant: DropdownPanelVariant.Rounded,
  minMaxStrategy: ArdDateInputMinMaxStrategy.Adjust,
  // calendar defaults
  activeView: ArdCalendarView.Days,
  activeYear: new Date().getFullYear(),
  activeMonth: new Date().getMonth(),
  firstWeekday: 1,
  multipleYearPageChangeModifier: 5,
  min: null,
  max: null,
  filter: null,
  UTC: false,
};

export const ARD_DATE_INPUT_DEFAULTS = new InjectionToken<ArdDateInputDefaults>('ard-date-input-defaults', {
  factory: () => ({ ..._dateInputDefaults }),
});

export function provideDateInputDefaults(config: Partial<ArdDateInputDefaults>): Provider {
  return { provide: ARD_DATE_INPUT_DEFAULTS, useValue: { ..._dateInputDefaults, ...config } };
}
