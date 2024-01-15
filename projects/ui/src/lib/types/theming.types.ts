

//! appearances
export const OutlinedAppearance = {
    /**
     * No background with solid border.
     */
    Outlined: 'outlined',
} as const;
export type OutlinedAppearance = typeof OutlinedAppearance[keyof typeof OutlinedAppearance];

export const PanelAppearance = {
    /**
     * Filled with a background color, with slight shadow.
     */
    Raised: 'raised',
} as const;
export type PanelAppearance = typeof PanelAppearance[keyof typeof PanelAppearance];

export const FormElementAppearance = {
    ...OutlinedAppearance,
    /**
     * No background and no border. Useful for when trying to create a component that uses another component inside its borders.
     */
    Transparent: 'transparent',
    /**
     * Slighthly darker/lighter background with rounded but transparent border.
     */
    Filled: 'filled',
} as const;
export type FormElementAppearance = typeof FormElementAppearance[keyof typeof FormElementAppearance];

export const DecorationElementAppearance = {
    Outlined: 'outlined',
    OutlinedStrong: 'outlined-strong',
    Filled: 'filled',
} as const;
export type DecorationElementAppearance = typeof DecorationElementAppearance[keyof typeof DecorationElementAppearance];

//! variants
export const PanelVariant = {
    /**
     * Slightly rounded corners.
     */
    Rounded: 'rounded',
    /**
     * Sharp corners.
     */
    Sharp: 'sharp',
} as const;
export type PanelVariant = typeof PanelVariant[keyof typeof PanelVariant];

export const FormElementVariant = {
    ...PanelVariant,
    /**
     * Fully rounded corners - pill shaped.
     */
    Pill: 'pill',
} as const;
export type FormElementVariant = typeof FormElementVariant[keyof typeof FormElementVariant];