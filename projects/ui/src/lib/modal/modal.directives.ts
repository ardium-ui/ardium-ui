import { Directive, TemplateRef } from '@angular/core';

@Directive({ standalone: false, selector: 'ard-modal > ng-template[ard-close-icon-tmp]' })
export class ArdModalCloseIconTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}
