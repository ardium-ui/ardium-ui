import { Directive, TemplateRef } from '@angular/core';
import { ProgressBarValueContext } from './progress-bar.types';

@Directive({ selector: 'ard-progress-bar > ng-template[ard-value-tmp]' })
export class ArdProgressBarValueTemplateDirective {
    constructor(public template: TemplateRef<ProgressBarValueContext>) {}
}
