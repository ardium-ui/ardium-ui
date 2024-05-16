

export const ArdSlideToggleAppearance = {
  Raised: 'raised',
  Contained: 'contained',
} as const;
export type ArdSlideToggleAppearance = typeof ArdSlideToggleAppearance[keyof typeof ArdSlideToggleAppearance];