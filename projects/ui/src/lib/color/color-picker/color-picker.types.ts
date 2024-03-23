import * as Color from 'color';

export type ColorPickerIndicatorContext = {
    $implicit: Color;
};

export type ColorPickerColorReferenceContext = {
    color: Color;
    $implicit: Color;
    referenceColor: Color;
};

export const _ColorPickerInputsSectionType = {
    HEX: 'HEX',
    RGB: 'RGB',
    HSL: 'HSL',
    HSV: 'HSV',
} as const;
export type _ColorPickerInputsSectionType = (typeof _ColorPickerInputsSectionType)[keyof typeof _ColorPickerInputsSectionType];

export const ColorPickerVariant = {
    Rounded: 'rounded',
    Sharp: 'sharp',
} as const;
export type ColorPickerVariant = (typeof ColorPickerVariant)[keyof typeof ColorPickerVariant];
