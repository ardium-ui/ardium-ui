import { Directive, TemplateRef } from "@angular/core";
import { ArdStarDisplayStarTemplateContext } from "./star-display.types";

@Directive({
  selector: 'ard-star-display > ng-template[ard-star-tmp]',
})
export class ArdStarDisplayStarTemplateDirective {
  constructor(public template: TemplateRef<ArdStarDisplayStarTemplateContext>) {}
}