import { Directive, TemplateRef } from '@angular/core';
import { PlaceholderContext } from '../../select';
import { ArdDateInputValueContext } from './date-input.types';

//public (exported)

@Directive({ selector: 'ard-date-input > ng-template[ard-prefix-tmp]' })
export class ArdDateInputPrefixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-date-input > ng-template[ard-suffix-tmp]' })
export class ArdDateInputSuffixTemplateDirective {
  constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-date-input > ng-template[ard-value-tmp]' })
export class ArdDateInputValueTemplateDirective {
  constructor(public template: TemplateRef<ArdDateInputValueContext>) {}
}

@Directive({ selector: 'ard-date-input > ng-template[ard-placeholder-tmp]' })
export class ArdDateInputPlaceholderTemplateDirective {
  constructor(public template: TemplateRef<PlaceholderContext>) {}
}