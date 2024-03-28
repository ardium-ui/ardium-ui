import { Directive, TemplateRef } from '@angular/core';
import { OptionContext } from '../../types/item-storage.types';

@Directive({ selector: 'ard-input > ng-template[ard-suggestion-tmp]' })
export class ArdSuggestionTemplateDirective {
  constructor(public template: TemplateRef<OptionContext>) {}
}

@Directive({ selector: 'ard-input > ng-template[ard-placeholder-tmp]' })
export class ArdInputPlaceholderTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-input > ng-template[ard-loading-tmp]' })
export class ArdInputLoadingTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-input > ng-template[ard-prefix-tmp]' })
export class ArdInputPrefixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-input > ng-template[ard-suffix-tmp]' })
export class ArdInputSuffixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}
