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

export const DecorationElementAppearance = {
    Outlined: 'outlined',
    Filled: 'filled',
} as const;
export type DecorationElementAppearance = typeof DecorationElementAppearance[keyof typeof DecorationElementAppearance];