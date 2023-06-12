import { Directive, TemplateRef } from "@angular/core";


@Directive({ selector: 'ng-template[ard-prefix-tmp]' })
export class ArdFormFieldPrefixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ng-template[ard-suffix-tmp]' })
export class ArdFormFieldSuffixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}