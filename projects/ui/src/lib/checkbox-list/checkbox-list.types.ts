export const CheckboxListAlignType = {
    LeftClumped: 'left-clumped',
    LeftSplit: 'left-split',
    RightSplit: 'right-split',
    RightClumped: 'right-clumped',
} as const;
export type CheckboxListAlignType =
    (typeof CheckboxListAlignType)[keyof typeof CheckboxListAlignType];
