import { Directive, TemplateRef } from '@angular/core';
import { CheckboxTemplateContext } from '../checkbox/checkbox.types';

@Directive({ selector: 'ard-checkbox-list > ng-template[ard-checkbox-tmp]' })
export class ArdCheckboxListCheckboxTemplateDirective {
  constructor(public template: TemplateRef<CheckboxTemplateContext>) {}
}
