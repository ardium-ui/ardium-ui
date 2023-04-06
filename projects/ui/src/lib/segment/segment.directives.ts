import { Directive, TemplateRef } from "@angular/core";
import { OptionContext } from "../types/item-storage.types";



@Directive({ selector: 'ng-template[ard-segm-option-tmp]' })
export class ArdSegmentOptionTemplateDirective {
    constructor(public template: TemplateRef<OptionContext>) {}
}