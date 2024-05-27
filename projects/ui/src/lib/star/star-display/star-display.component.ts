import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { coerceNumberProperty } from '@ardium-ui/devkit';
import { isArray } from 'simple-bool';
import { StarColor, StarFillMode } from './../star.types';

@Component({
  selector: 'ard-star-display',
  templateUrl: './star-display.component.html',
  styleUrls: ['./star-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumStarDisplayComponent {
  readonly wrapperClasses = input<string>('');

  //! appearance
  readonly color = input<StarColor>(StarColor.Star);

  readonly ngClasses = computed<string>(() => [this.wrapperClasses(), `ard-color-${this.color}`].join(' '));

  //! stars
  readonly max = input<number, any>(5, { transform: v => coerceNumberProperty(v, 0) });

  readonly value = input<number | StarFillMode[], string | number | StarFillMode[]>(0, {
    transform: v => {
      if (isArray(v)) {
        return v;
      }
      return coerceNumberProperty(v, 0);
    },
  });

  readonly starArray = computed<StarFillMode[]>(() => {
    let v = this.value();
    let newArr: StarFillMode[];

    // pad the array with non-filled stars and return it
    if (isArray(v)) {
      newArr = [...v];
      while (newArr.length < this.max()) {
        newArr.push(StarFillMode.None);
      }
      return newArr;
    }

    // create an array from a numeric value
    newArr = [];
    while (newArr.length < this.max()) {
      v--;
      if (v + 1 >= 1) {
        newArr.push(StarFillMode.Filled);
        continue;
      }
      if (Math.round(v + 1) == 1) {
        newArr.push(StarFillMode.Half);
        continue;
      }
      newArr.push(StarFillMode.None);
    }
    return newArr;
  });
}
