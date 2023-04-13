export type SliderTooltipContext = {
    value: string | number;
    $implicit: string | number;
}

export const SliderDecorationPosition = {
    Top: 'top',
    Bottom: 'bottom',
} as const;
export type SliderDecorationPosition = typeof SliderDecorationPosition[keyof typeof SliderDecorationPosition]; 

export type SliderLabelObject = {
    label: string | number;
    for: number;
}
export type _InternalSliderLabelObject = {
    label: string;
    positionPercent: string;
}

export type SliderRange<T = number> = {
    low: T,
    high: T,
}

export type SliderTooltipFormatFn = (value: number) => string | number;