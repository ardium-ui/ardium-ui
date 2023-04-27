import * as Color from "color"


export type ColorPickerIndicatorContext = {
    $implicit: Color;
}

export type ColorPickerColorWindowContext = {
    color: Color;
    $implicit: Color;
    referenceColor: Color;
}

export const ColorPickerVariant = {
    Rounded: 'rounded',
    Sharp: 'sharp',
} as const;
export type ColorPickerVariant = typeof ColorPickerVariant[keyof typeof ColorPickerVariant];