import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _BooleanComponentBase } from '../../_internal/boolean-component';
import { ClickStrategy } from '../../types/utility.types';
import { StarColor } from '../star.types';
import { StarFillMode } from './../star.types';

@Component({
  selector: 'ard-star-button',
  templateUrl: './star-button.component.html',
  styleUrls: ['./star-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumStarButtonComponent),
      multi: true,
    },
  ],
})
export class ArdiumStarButtonComponent extends _BooleanComponentBase implements ControlValueAccessor {
  readonly wrapperClasses = input<string>('');

  readonly clickStrategy = input<ClickStrategy>(ClickStrategy.Default);

  //! appearance
  readonly color = input<StarColor>(StarColor.Star);

  readonly ngClasses = computed<string>(() => [this.wrapperClasses(), `ard-color-${this.color}`].join(' '));

  readonly starFillState = computed<StarFillMode>(() => (this.selected() ? StarFillMode.Filled : StarFillMode.None));

  onClick(): void {
    if (this.clickStrategy() === ClickStrategy.Noop) return;
    this.toggleSelected();
  }
}
