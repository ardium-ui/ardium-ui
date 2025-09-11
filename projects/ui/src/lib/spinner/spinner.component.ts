import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { SimpleComponentColor } from '../types/colors.types';
import { ARD_SPINNER_DEFAULTS } from './spinner.defaults';

@Component({
  standalone: false,
  selector: 'ard-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumSpinnerComponent {
  protected readonly _DEFAULTS = inject(ARD_SPINNER_DEFAULTS);

  //! appearance
  readonly color = input<SimpleComponentColor>(this._DEFAULTS.color);

  readonly ngClasses = computed((): string => [`ard-color-${this.color()}`].join(' '));
}
