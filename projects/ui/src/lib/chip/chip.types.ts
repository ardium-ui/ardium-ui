
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