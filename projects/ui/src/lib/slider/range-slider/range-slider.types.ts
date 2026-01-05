export const ArdRangeSelectionBehavior = {
  Push: 'push',
  Allow: 'allow',
  Block: 'block',
} as const;
export type ArdRangeSelectionBehavior = typeof ArdRangeSelectionBehavior[keyof typeof ArdRangeSelectionBehavior];