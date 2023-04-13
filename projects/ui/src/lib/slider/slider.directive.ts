import { Directive, TemplateRef } from '@angular/core';
import { SliderTooltipContext } from './slider.types';

@Directive({
  selector: 'ng-template[ard-slider-tooltip-tmp]'
})
export class ArdSliderTooltipDirective {
    constructor(public template: TemplateRef<SliderTooltipContext>) {  }
}
