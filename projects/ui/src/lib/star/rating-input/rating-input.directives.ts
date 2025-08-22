import { Directive, TemplateRef } from "@angular/core";
import { ArdRatingInputStarButtonTemplateContext } from "./rating-input.types";

@Directive({
  selector: 'ard-rating-input > ng-template[ard-star-button-tmp]',
})
export class ArdRatingInputStarButtonTemplateDirective {
  constructor(public template: TemplateRef<ArdRatingInputStarButtonTemplateContext>) {}
}