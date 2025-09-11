import { Directive, TemplateRef } from '@angular/core';
import { ColorPickerColorReferenceContext, ColorPickerIndicatorContext } from './color-picker.types';

@Directive({
  standalone: false,
  selector: 'ard-color-picker > ng-template[ard-shade-indicator-tmp]',
})
export class ArdColorPickerShadeIndicatorTemplateDirective {
  constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-color-picker > ng-template[ard-hue-indicator-tmp]',
})
export class ArdColorPickerHueIndicatorTemplateDirective {
  constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-color-picker > ng-template[ard-opacity-indicator-tmp]',
})
export class ArdColorPickerOpacityIndicatorTemplateDirective {
  constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-color-picker > ng-template[ard-color-reference-tmp]',
})
export class ArdColorPickerColorReferenceTemplateDirective {
  constructor(public template: TemplateRef<ColorPickerColorReferenceContext>) {}
}
