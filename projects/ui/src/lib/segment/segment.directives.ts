import { Directive, TemplateRef } from '@angular/core';

@Directive({ standalone: false, selector: 'ng-template[ard-segm-option-tmp]' })
export class ArdSegmentOptionTemplateDirective {
  constructor(readonly template: TemplateRef<any>) {}
}
