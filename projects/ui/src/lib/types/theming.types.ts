export const FormElementAppearance = {
    /**
     * No background and no border. Useful for when trying to create a component that uses another component inside its borders.
     */
    Transparent: 'transparent',
    /**
     * No background with solid border.
     */
    Outlined: 'outlined',
    /**
     * Slighthly darker/lighter background with rounded but transparent border.
     */
    Filled: 'filled',
} as const;
export type FormElementAppearance = typeof FormElementAppearance[keyof typeof FormElementAppearance];

export const FormElementVariant = {
    /**
     * Slightly rounded corners.
     */
    Rounded: 'rounded',
    /**
     * Fully rounded corners - pill shaped.
     */
    Pill: 'pill',
    /**
     * Sharp corners.
     */
    Sharp: 'sharp',
} as const;
export type FormElementVariant = typeof FormElementVariant[keyof typeof FormElementVariant];

export const DecorationElementAppearance = {
    Outlined: 'outlined',
    OutlinedStrong: 'outlined-strong',
    Filled: 'filled',
} as const;
export type DecorationElementAppearance = typeof DecorationElementAppearance[keyof typeof DecorationElementAppearance];