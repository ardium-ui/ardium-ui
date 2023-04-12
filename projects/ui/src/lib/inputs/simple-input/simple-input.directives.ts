import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-simple-input > ng-template[ard-placeholder-tmp]' })
export class ArdSimpleInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}