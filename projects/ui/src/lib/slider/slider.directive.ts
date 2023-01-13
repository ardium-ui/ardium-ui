import { Directive, TemplateRef } from '@angular/core';
import { SliderLabelContext } from './slider.types';

@Directive({
  selector: 'ng-template[ard-slider-label]'
})
export class ArdSliderLabelDirective {
    constructor(public template: TemplateRef<SliderLabelContext>) {  }
}
