export const ArdNumberInputMinMaxBehavior = {
  AdjustOnInput: 'adjust-on-input',
  AdjustOnBlur: 'adjust-on-blur',
  Noop: 'noop',
} as const;
export type ArdNumberInputMinMaxBehavior = typeof ArdNumberInputMinMaxBehavior[keyof typeof ArdNumberInputMinMaxBehavior];