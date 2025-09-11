import { Directive, TemplateRef } from '@angular/core';
import { DialogButtonsContext } from './dialog.types';

@Directive({ standalone: false, selector: 'ard-dialog > ng-template[ard-buttons-tmp]' })
export class ArdDialogButtonsTemplateDirective {
  constructor(public template: TemplateRef<DialogButtonsContext>) {}
}

@Directive({ standalone: false, selector: 'ard-dialog > ng-template[ard-close-icon-tmp]' })
export class ArdDialogCloseIconTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}
