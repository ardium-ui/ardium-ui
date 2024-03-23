import { Directive, TemplateRef } from '@angular/core';
import { DialogButtonsContext } from './dialog.types';

@Directive({ selector: 'ard-dialog > ng-template[ard-buttons-tmp]' })
export class ArdDialogButtonsTemplateDirective {
    constructor(public template: TemplateRef<DialogButtonsContext>) {}
}
