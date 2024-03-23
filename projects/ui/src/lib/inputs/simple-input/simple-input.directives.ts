import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-simple-input > ng-template[ard-placeholder-tmp]' })
export class ArdSimpleInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-simple-input > ng-template[ard-prefix-tmp]' })
export class ArdSimpleInputPrefixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-simple-input > ng-template[ard-suffix-tmp]' })
export class ArdSimpleInputSuffixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) {}
}
