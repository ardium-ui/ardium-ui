import { Directive, TemplateRef } from '@angular/core';
import { SliderTooltipContext } from './slider.types';

@Directive({
  standalone: false,
  selector: 'ng-template[ard-slider-tooltip-tmp]',
})
export class ArdSliderTooltipDirective {
  constructor(public template: TemplateRef<SliderTooltipContext>) {}
}
