import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { SimpleComponentColor } from '../types/colors.types';

@Component({
  selector: 'ard-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumSpinnerComponent {
  //! appearance
  readonly color = input<SimpleComponentColor>(SimpleComponentColor.Primary);

  readonly ngClasses = computed((): string => [`ard-color-${this.color()}`].join(' '));
}
