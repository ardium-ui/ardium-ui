

export const BadgeSize = {
    Small: 'small',
    Medium: 'medium',
    Large: 'large',
} as const;
export type BadgeSize = typeof BadgeSize[keyof typeof BadgeSize];

export const BadgePosition = {
    AboveBefore: 'above-before',
    AboveAfter: 'above-after',
    BelowBefore: 'below-before',
    BelowAfter: 'below-after',
    Before: 'before',
    After: 'after',
    Above: 'above',
    Below: 'below',
} as const;
export type BadgePosition = typeof BadgePosition[keyof typeof BadgePosition];