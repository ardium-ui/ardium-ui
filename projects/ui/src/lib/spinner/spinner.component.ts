import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
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
  @Input() color: SimpleComponentColor = SimpleComponentColor.Primary;

  get ngClasses(): string {
    return [`ard-color-${this.color}`].join(' ');
  }
}
