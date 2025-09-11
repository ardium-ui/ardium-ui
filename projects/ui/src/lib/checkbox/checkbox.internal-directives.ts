import { Directive, input, TemplateRef } from '@angular/core';
import { ArdCheckboxTemplateDirective } from './checkbox.directives';

@Directive({ standalone: true, selector: 'ard-checkbox > ng-template[_ard-tmp-repository]' })
export class _CheckboxTemplateRepositoryDirective {
  constructor(public template: TemplateRef<undefined>) {}

  readonly checkboxTmp = input<ArdCheckboxTemplateDirective | undefined>(undefined);
}
