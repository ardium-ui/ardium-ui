import { FormElementAppearance, FormElementVariant } from "../types/theming.types";


export const SegmentVariant = {
    ...FormElementVariant,
    RoundedConnected: 'rounded-connected',
    SharpConnected: 'sharp-connected',
} as const;
export type SegmentVariant = typeof SegmentVariant[keyof typeof SegmentVariant];

export const SegmentAppearance = {
    ...FormElementAppearance,
    FilledStrong: 'filled-strong',
    OutlinedStrong: 'outlined-strong',
} as const;
export type SegmentAppearance = typeof SegmentAppearance[keyof typeof SegmentAppearance];