

export const PaginationAlign = {
    Left: 'left',
    Center: 'center',
    Right: 'right',
    Split: 'split',
} as const;
export type PaginationAlign = typeof PaginationAlign[keyof typeof PaginationAlign];