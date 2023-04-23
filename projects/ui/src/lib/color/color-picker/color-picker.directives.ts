import { Directive, TemplateRef } from '@angular/core';
import { ColorPickerIndicatorContext } from './color-picker.types';

@Directive({ selector: 'ard-color-picker > ng-template[ard-hue-indicator-tmp]' })
export class ArdColorPickerHueIndicatorTemplateDirective {
    constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {  }
}

@Directive({ selector: 'ard-color-picker > ng-template[ard-shade-indicator-tmp]' })
export class ArdColorPickerShadeIndicatorTemplateDirective {
    constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {  }
}
