import { Directive, TemplateRef } from "@angular/core";
import { ArdStarInputStarButtonTemplateContext } from "./star-input.types";

@Directive({
  selector: 'ard-star-input > ng-template[ard-star-button-tmp]',
})
export class ArdStarInputStarButtonTemplateDirective {
  constructor(public template: TemplateRef<ArdStarInputStarButtonTemplateContext>) {}
}