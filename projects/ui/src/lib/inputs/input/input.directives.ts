
import { Directive, TemplateRef } from '@angular/core';
import { OptionContext } from '../../types/item-storage.types';

@Directive({ selector: 'ng-template[ard-suggestion-tmp]' })
export class ArdSuggestionTemplateDirective {
    constructor(public template: TemplateRef<OptionContext>) {  }
}