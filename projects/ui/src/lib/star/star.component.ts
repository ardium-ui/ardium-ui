import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { StarColor, StarFillMode } from './star.types';

@Component({
  selector: 'ard-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumStarComponent {
  readonly wrapperClasses = input<string>('');

  //! appearance
  readonly color = input<StarColor>(StarColor.Star);
  readonly fill = input<StarFillMode>(StarFillMode.Filled);

  readonly ngClasses = computed<string>(() =>
    [this.wrapperClasses(), `ard-color-${this.color}`, `ard-star-fill-${this.fill}`].join(' ')
  );
}
