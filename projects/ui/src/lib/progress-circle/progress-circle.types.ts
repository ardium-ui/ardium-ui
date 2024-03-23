export type ProgressCircleValueContext = {
    value: number;
    percentValue: number;
    max: number;
    $implicit: number;
};

export const ProgressCircleAppearance = {
    Transparent: 'transparent',
    Colorless: 'colorless',
    Colored: 'colored',
} as const;
export type ProgressCircleAppearance =
    (typeof ProgressCircleAppearance)[keyof typeof ProgressCircleAppearance];

export const ProgressCircleVariant = {
    Full: 'full',
    Ring: 'ring',
} as const;
export type ProgressCircleVariant =
    (typeof ProgressCircleVariant)[keyof typeof ProgressCircleVariant];
