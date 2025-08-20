import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-modal > ng-template[ard-close-icon-tmp]' })
export class ArdModalCloseIconTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}
