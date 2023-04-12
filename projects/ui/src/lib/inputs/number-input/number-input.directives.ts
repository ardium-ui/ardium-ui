import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-number-input > ng-template[ard-placeholder-tmp]' })
export class ArdNumberInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}