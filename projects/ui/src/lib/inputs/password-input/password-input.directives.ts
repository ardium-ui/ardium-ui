import { Directive, TemplateRef } from '@angular/core';
import { PasswordInputRevealButtonContext } from './password-input.types';

@Directive({ selector: 'ard-password-input > ng-template[ard-placeholder-tmp]' })
export class ArdPasswordInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-password-input > ng-template[ard-prefix-tmp]' })
export class ArdPasswordInputPrefixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-password-input > ng-template[ard-suffix-tmp]' })
export class ArdPasswordInputSuffixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-password-input > ng-template[ard-reveal-tmp]' })
export class ArdPasswordInputRevealButtonTemplateDirective {
    constructor(public template: TemplateRef<PasswordInputRevealButtonContext>) { }
}