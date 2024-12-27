import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { ARD_STAR_DEFAULTS } from './star.defaults';
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

  protected readonly _DEFAULTS = inject(ARD_STAR_DEFAULTS);

  //! appearance
  readonly color = input<StarColor>(this._DEFAULTS.color);
  readonly filled = input<StarFillMode, StarFillMode | boolean>(this._transformFillMode(this._DEFAULTS.filled), {
    transform: this._transformFillMode,
  });

  private _transformFillMode(value: StarFillMode | boolean): StarFillMode {
    return typeof value === 'boolean' ? (value ? StarFillMode.Filled : StarFillMode.None) : value;
  }

  readonly ngClasses = computed<string>(() =>
    [this.wrapperClasses(), `ard-color-${this.color()}`, `ard-star-fill-${this.filled()}`].join(' ')
  );
}
