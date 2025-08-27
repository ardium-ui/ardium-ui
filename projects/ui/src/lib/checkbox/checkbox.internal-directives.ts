import { Directive, input, TemplateRef } from '@angular/core';
import { ArdCheckboxTemplateDirective } from './checkbox.directives';

@Directive({ selector: 'ard-checkbox > ng-template[_ard-tmp-repository]', standalone: true })
export class _CheckboxTemplateRepositoryDirective {
  constructor(public template: TemplateRef<undefined>) {}

  readonly checkboxTmp = input<ArdCheckboxTemplateDirective | undefined>(undefined);
}
