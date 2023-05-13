import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: 'ard-hex-input > ng-template[ard-placeholder-tmp]' })
export class ArdHexInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}