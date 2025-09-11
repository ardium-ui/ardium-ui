import { Directive, TemplateRef } from '@angular/core';
import { ArdStarIconContext } from './star.types';

@Directive({
  standalone: false,
  selector: 'ard-star > ng-template[ard-star-icon-tmp]',
})
export class ArdStarIconTemplateDirective {
  constructor(public template: TemplateRef<ArdStarIconContext>) {}
}
