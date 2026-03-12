import { Directive } from '@angular/core';
import { ArdiumDividerDirective } from './divider.directive';

@Directive({
  standalone: true,
  host: {
    role: 'separator',
    '[class]': 'ngClasses()',
  },
})
export class _DividerDirective extends ArdiumDividerDirective {}
