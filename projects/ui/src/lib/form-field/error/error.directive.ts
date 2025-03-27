import { Directive } from '@angular/core';

@Directive({
  selector: '[ard-error]',
  standalone: true,
  host: {
    '[class.ard-error]': 'true',
  },
})
export class ArdiumErrorDirective {}
