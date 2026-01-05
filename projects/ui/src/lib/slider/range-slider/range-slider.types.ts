export const ArdRangeSliderOverlapBehavior = {
  Push: 'push',
  Allow: 'allow',
  Block: 'block',
} as const;
export type ArdRangeSliderOverlapBehavior = typeof ArdRangeSliderOverlapBehavior[keyof typeof ArdRangeSliderOverlapBehavior];