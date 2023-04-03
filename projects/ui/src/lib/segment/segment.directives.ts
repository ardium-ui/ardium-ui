import { Directive, TemplateRef } from "@angular/core";
import { OptionContext } from "../_internal/item-storages/item-storage.types";



@Directive({ selector: 'ng-template[ard-option-tmp]' })
export class ArdSegmentOptionTemplateDirective {
    constructor(public template: TemplateRef<OptionContext>) {}
}