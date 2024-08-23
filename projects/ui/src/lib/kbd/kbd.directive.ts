import { computed, Directive, input } from '@angular/core';
import { FormElementAppearance } from 'dist/ui';

@Directive({
  selector: '[ardKbd]',
  standalone: true,
  host: {
    '[ngClass]': 'ngClasses()',
  },
})
export class KbdDirective {
  readonly myProp = input<string>();

  //! appearance
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Filled, { alias: 'ardKbdAppearance' });

  readonly ngClasses = computed<string>(() => ['ard-kbd', `ard-appearance-${this.appearance()}`].join(' '));
}
