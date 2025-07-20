import { Directive, TemplateRef } from "@angular/core";
import { ArdStarButtonStarTemplateContext } from "./star-button.types";

@Directive({
  selector: 'ard-star-button > ng-template[ard-star-tmp]',
})
export class ArdStarButtonStarTemplateDirective {
  constructor(public template: TemplateRef<ArdStarButtonStarTemplateContext>) {}
}