



export const ChipContentAlignment = {
    Left: 'left',
    Right: 'right',
} as const;
export type ChipContentAlignment = typeof ChipContentAlignment[keyof typeof ChipContentAlignment];

export const ChipVariant = {
    /**
     * Basic, rectangular chip.
     */
    Basic: 'basic',
    /**
     * Pill-shaped chip.
     */
    Pill: 'pill',
} as const;
export type ChipVariant = typeof ChipVariant[keyof typeof ChipVariant];

/**
 * General button appearance. Controls which parts of the button can be colored.
 * 
 * @see {@link ButtonColoringMode}
 */
export const ButtonAppearance = {
    /**
     * No border and no background. Text and icon are colored.
     */
    Transparent: 'transparent',
    /**
     * No border, but with text shadow. Text, icon, and background are colored.
     */
    Raised: 'raised',
    /**
     * No border, but with text shadow. White background. Text and icon are colored.
     */
    RaisedStrong: 'raised-strong',
    /**
     * White background. Text and icon are colored.
     */
    Outlined: 'outlined',
    /**
     * White background. Text, icon, and border may be colored.
     * 
     * Background becomes colored on hover/focus.
     */
    OutlinedStrong: 'outlined-strong',
    /**
     * No border. Text, icon, and background are colored.
     */
    Flat: 'flat',
} as const;
export type ButtonAppearance = typeof ButtonAppearance[keyof typeof ButtonAppearance];

export const ButtonVariant = {
    /**
     * Basic, rectangular button.
     */
    Basic: 'basic align-left',
    /**
     * Basic, rectangular button with the icon on the left side. Same as {@link ButtonVariant.Basic}.
     */
    BasicIconLeft: 'basic align-left',
    /**
     * Basic, rectangular button with the icon on the right side.
     */
    BasicIconRight: 'basic align-right',
    /**
     * Basic, rectangular button, with vertical layout.
     */
    BasicVertical: 'basic vertical',
    /**
     * Pill-shaped button.
     */
    Pill: 'pill align-left',
    /**
     * Pill-shaped button with the icon on the left side. Same as {@link ButtonVariant.Basic}.
     */
    PillIconLeft: 'pill align-left',
    /**
     * Pill-shaped button with the icon on the right side.
     */
    PillIconRight: 'pill align-right',
    /**
     * Basic, rectangular button with sharp corners.
     */
    Sharp: 'sharp align-left',
    /**
     * Basic, rectangular button with sharp corners, with the icon on the left side. Same as {@link ButtonVariant.Basic}.
     */
    SharpIconLeft: 'sharp align-left',
    /**
     * Basic, rectangular button with sharp corners, with the icon on the right side.
     */
    SharpIconRight: 'sharp align-right',
    /**
     * Basic, rectangular button with sharp corners, with vertical layout.
     */
    SharpVertical: 'sharp vertical',
} as const;
export type ButtonVariant = typeof ButtonVariant[keyof typeof ButtonVariant];

/**
 * **F**loating **A**ction **B**utton size.
 */
export const FABSize = {
    Standard: 'standard',
    Small: 'small',
} as const;
export type FABSize = typeof FABSize[keyof typeof FABSize];
