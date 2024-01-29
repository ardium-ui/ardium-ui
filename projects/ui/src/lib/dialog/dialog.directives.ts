import { Directive, TemplateRef } from "@angular/core";
import { DialogButtonsContext } from "./dialog.types";



@Directive({ selector: 'ard-calendar > ng-template[ard-month-picker-header-tmp], ard-datepicker > ng-template[ard-month-picker-header-tmp]' })
export class ArdDialogButtonsTemplateDirective {
    constructor(public template: TemplateRef<DialogButtonsContext>) { }
}