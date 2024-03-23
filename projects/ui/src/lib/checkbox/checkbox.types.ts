export const CheckboxState = {
    Unselected: 'unselected',
    Indeterminate: 'indeterminate',
    Selected: 'selected',
} as const;
export type CheckboxState = (typeof CheckboxState)[keyof typeof CheckboxState];
