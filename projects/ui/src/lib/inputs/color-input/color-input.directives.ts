import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-color-input > ng-template[ard-placeholder-tmp]' })
export class ArdColorInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-color-input ng-template[ard-prefix-tmp]' })
export class ArdColorInputPrefixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-color-input ng-template[ard-suffix-tmp]' })
export class ArdColorInputSuffixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}