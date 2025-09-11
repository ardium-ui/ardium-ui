import { Directive, TemplateRef } from '@angular/core';
import { ProgressCircleValueContext } from './progress-circle.types';

@Directive({ standalone: false, selector: 'ard-progress-circle > ng-template[ard-value-tmp]' })
export class ArdProgressCircleValueTemplateDirective {
  constructor(public template: TemplateRef<ProgressCircleValueContext>) {}
}
