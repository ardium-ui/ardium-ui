import { PaginationCurrentItemsContext } from '../_internal/models/pagination.model';

export const PaginationAlign = {
    Left: 'left',
    Center: 'center',
    Right: 'right',
    Split: 'split',
} as const;
export type PaginationAlign =
    (typeof PaginationAlign)[keyof typeof PaginationAlign];

export type CurrentItemsFormatFn = (
    context: PaginationCurrentItemsContext,
) => string;
