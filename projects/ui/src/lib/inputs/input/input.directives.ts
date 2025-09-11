import { Directive, TemplateRef } from '@angular/core';

@Directive({ standalone: false, selector: 'ard-input > ng-template[ard-placeholder-tmp]' })
export class ArdInputPlaceholderTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ standalone: false, selector: 'ard-input > ng-template[ard-prefix-tmp]' })
export class ArdInputPrefixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ standalone: false, selector: 'ard-input > ng-template[ard-suffix-tmp]' })
export class ArdInputSuffixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}
