export type ScrollAlignment = 'top' | 'bottom' | 'middle';

export const DropdownPanelAppearance = {
    Outlined: 'outlined',
    Raised: 'raised',
} as const;
export type DropdownPanelAppearance = typeof DropdownPanelAppearance[keyof typeof DropdownPanelAppearance];

export const DropdownPanelVariant = {
    Rounded: 'rounded',
    Sharp: 'sharp',
    SharpConnected: 'sharp ard-connected',
} as const;
export type DropdownPanelVariant = typeof DropdownPanelVariant[keyof typeof DropdownPanelVariant];