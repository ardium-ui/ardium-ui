import { Directive, TemplateRef } from '@angular/core';
import { CheckboxTemplateContext } from './checkbox.types';

@Directive({ selector: 'ard-checkbox > ng-template[ard-checkbox-tmp]' })
export class ArdCheckboxTemplateDirective {
  constructor(public template: TemplateRef<CheckboxTemplateContext>) {}
}
