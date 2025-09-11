import { Directive, TemplateRef } from '@angular/core';

@Directive({ standalone: false, selector: 'ard-form-field-frame > ng-template[ard-prefix-tmp]' })
export class ArdFormFieldPrefixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ standalone: false, selector: 'ard-form-field-frame > ng-template[ard-suffix-tmp]' })
export class ArdFormFieldSuffixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}
