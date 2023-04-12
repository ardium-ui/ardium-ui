
import { Directive, TemplateRef } from '@angular/core';
import { OptionContext } from '../../types/item-storage.types';

@Directive({ selector: 'ard-input > ng-template[ard-suggestion-tmp]' })
export class ArdSuggestionTemplateDirective {
    constructor(public template: TemplateRef<OptionContext>) {  }
}

@Directive({ selector: 'ard-input > ng-template[ard-placeholder-tmp]' })
export class ArdInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}