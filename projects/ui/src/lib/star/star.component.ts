import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { StarColor, StarFillMode } from './star.types';

@Component({
  selector: 'ard-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumStarComponent {
  @Input() wrapperClasses: string = '';
  @Input() fill: StarFillMode = StarFillMode.Filled;

  //* appearance
  @Input() color: StarColor = StarColor.Star;

  get ngClasses(): string {
    return [`ard-color-${this.color}`, `ard-star-fill-${this.fill}`].join(' ');
  }
}
