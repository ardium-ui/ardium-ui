import { Directive, TemplateRef } from '@angular/core';
import { CheckboxTemplateContext } from '../checkbox/checkbox.types';
import { ArdOptionSimple, OptionContext } from '../types/item-storage.types';

@Directive({ standalone: false, selector: 'ard-checkbox-list > ng-template[ard-checkbox-tmp]' })
export class ArdCheckboxListCheckboxTemplateDirective {
  constructor(public template: TemplateRef<CheckboxTemplateContext>) {}
}

@Directive({ standalone: false, selector: 'ard-checkbox-list > ng-template[ard-label-tmp]' })
export class ArdCheckboxListLabelTemplateDirective {
  constructor(public template: TemplateRef<OptionContext<ArdOptionSimple>>) {}
}
