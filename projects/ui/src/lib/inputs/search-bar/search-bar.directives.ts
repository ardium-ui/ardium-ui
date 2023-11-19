import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-search-bar > ng-template[ard-placeholder-tmp]' })
export class ArdSearchBarPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-search-bar > ng-template[ard-prefix-tmp]' })
export class ArdSearchBarPrefixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-search-bar > ng-template[ard-suffix-tmp]' })
export class ArdSearchBarSuffixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}