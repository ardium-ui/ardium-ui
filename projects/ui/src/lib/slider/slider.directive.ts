import { Directive, TemplateRef } from '@angular/core';
import { SliderTooltipContext } from './slider.types';

@Directive({
  selector: 'ng-template[ard-slider-label]'
})
export class ArdSliderTooltipDirective {
    constructor(public template: TemplateRef<SliderTooltipContext>) {  }
}
