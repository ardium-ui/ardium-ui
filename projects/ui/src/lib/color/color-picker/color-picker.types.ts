import * as Color from "color"


export type ColorPickerIndicatorContext = {
    $implicit: Color;
}

export type ColorPickerDisplayContext = {
    color: Color;
    $implicit: Color;
    referenceColor: Color;
}