import { Directive, TemplateRef } from "@angular/core";
import { ArdStarIconContext } from "./star.types";

@Directive({
  selector: 'ard-star > ng-template[ard-star-icon-tmp]',
})
export class ArdStarIconDirective {
  constructor(public template: TemplateRef<ArdStarIconContext>) {}
}