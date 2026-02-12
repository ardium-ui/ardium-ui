import { Directive, TemplateRef } from '@angular/core';

@Directive({ standalone: false, selector: 'ard-number-input > ng-template[ard-placeholder-tmp]' })
export class ArdNumberInputPlaceholderTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ standalone: false, selector: 'ard-number-input > ng-template[ard-prefix-tmp]' })
export class ArdNumberInputPrefixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ standalone: false, selector: 'ard-number-input > ng-template[ard-suffix-tmp]' })
export class ArdNumberInputSuffixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}