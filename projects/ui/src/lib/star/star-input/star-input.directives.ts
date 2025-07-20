import { Directive, TemplateRef } from "@angular/core";
import { ArdStarInputStarButtonTemplateContext } from "./star-input.types";

@Directive({
  selector: 'ard-star-input > ng-template[ard-star-tmp]',
})
export class ArdStarInputStarButtonTemplateDirective {
  constructor(public template: TemplateRef<ArdStarInputStarButtonTemplateContext>) {}
}