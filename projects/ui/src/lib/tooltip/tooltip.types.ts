export const ArdiumTooltipPosition = {
  Top: 'top',
  Bottom: 'bottom',
  Left: 'left',
  Right: 'right',
} as const;
export type ArdiumTooltipPosition = typeof ArdiumTooltipPosition[keyof typeof ArdiumTooltipPosition];

export const ArdiumTooltipAlign = {
  Start: 'start',
  Center: 'center',
  End: 'end',
} as const;
export type ArdiumTooltipAlign = typeof ArdiumTooltipAlign[keyof typeof ArdiumTooltipAlign];