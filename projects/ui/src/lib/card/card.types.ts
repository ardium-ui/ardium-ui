

export const CardAppearance = {
    Outlined: 'outlined',
    Raised: 'raised',
} as const;
export type CardAppearance = typeof CardAppearance[keyof typeof CardAppearance];

export const CardVariant = {
    Rounded: 'rounded',
    Sharp: 'sharp',
} as const;
export type CardVariant = typeof CardVariant[keyof typeof CardVariant];