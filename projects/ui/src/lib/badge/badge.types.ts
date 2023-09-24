

export const BadgeSize = {
    Small: 'small',
    Medium: 'medium',
    Large: 'large',
} as const;
export type BadgeSize = typeof BadgeSize[keyof typeof BadgeSize];

export const BadgePosition = {
    AboveBefore: 'above-before',
    AboveAfter: 'above-after',
    AboveLeft: 'above-left',
    AboveRight: 'above-right',
    BelowBefore: 'below-before',
    BelowAfter: 'below-after',
    BelowLeft: 'below-left',
    BelowRight: 'below-right',
    Before: 'before',
    After: 'after',
    Left: 'left',
    Right: 'right',
    Above: 'above',
    Below: 'below',
} as const;
export type BadgePosition = typeof BadgePosition[keyof typeof BadgePosition];