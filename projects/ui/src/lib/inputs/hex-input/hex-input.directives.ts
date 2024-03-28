import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-hex-input > ng-template[ard-placeholder-tmp]' })
export class ArdHexInputPlaceholderTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-hex-input ng-template[ard-prefix-tmp]' })
export class ArdHexInputPrefixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-hex-input ng-template[ard-suffix-tmp]' })
export class ArdHexInputSuffixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}
