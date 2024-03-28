export const ColorDisplayAppearance = {
  Rounded: 'rounded with-border',
  Circle: 'circle with-border',
  Sharp: 'sharp with-border',
  RoundedBorderless: 'rounded',
  CircleBorderless: 'circle',
  SharpBorderless: 'sharp',
} as const;
export type ColorDisplayAppearance = (typeof ColorDisplayAppearance)[keyof typeof ColorDisplayAppearance];
