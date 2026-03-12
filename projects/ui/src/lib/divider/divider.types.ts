export const ArdDividerVariant = {
  Full: 'full',
  Middle: 'middle',
} as const;
export type ArdDividerVariant = typeof ArdDividerVariant[keyof typeof ArdDividerVariant];