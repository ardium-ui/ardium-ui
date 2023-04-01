export type SliderLabelContext = {
    $implicit: number;
}

export const SliderLabelPosition = {
    Top: 'top',
    Bottom: 'bottom',
} as const;
export type SliderLabelPosition = typeof SliderLabelPosition[keyof typeof SliderLabelPosition]; 

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