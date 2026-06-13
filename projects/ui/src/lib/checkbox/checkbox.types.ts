import { InputSignal } from '@angular/core';

export const CheckboxState = {
  Unselected: 'unselected',
  Indeterminate: 'indeterminate',
  Selected: 'selected',
} as const;
export type CheckboxState = (typeof CheckboxState)[keyof typeof CheckboxState];

export interface CheckboxTemplateContext {
  $implicit: boolean;
  selected: boolean;
  internalSelected: boolean;
  state: CheckboxState;
  internalState: CheckboxState;
}

export interface ArdCheckboxIcon {
  selected?: InputSignal<boolean>;
  internalSelected?: InputSignal<boolean>;
  state?: InputSignal<CheckboxState>;
  internalState?: InputSignal<CheckboxState>;
}
