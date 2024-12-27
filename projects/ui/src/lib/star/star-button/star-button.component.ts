import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, computed, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _BooleanComponentBaseWithDefaults } from '../../_internal/boolean-component';
import { ClickStrategy } from '../../types/utility.types';
import { StarColor } from '../star.types';
import { StarFillMode } from './../star.types';
import { ARD_STAR_BUTTON_DEFAULTS, ArdStarButtonDefaults } from './star-button.defaults';

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
export class ArdiumStarButtonComponent extends _BooleanComponentBaseWithDefaults implements ControlValueAccessor {
  readonly wrapperClasses = input<string>('');

  protected override readonly _DEFAULTS!: ArdStarButtonDefaults;
  constructor(@Inject(ARD_STAR_BUTTON_DEFAULTS) defaults: ArdStarButtonDefaults) {
    super(defaults);
  }

  readonly clickStrategy = input<ClickStrategy>(this._DEFAULTS.clickStrategy);

  //! appearance
  readonly color = input<StarColor>(this._DEFAULTS.color);

  readonly ngClasses = computed<string>(() => [this.wrapperClasses(), `ard-color-${this.color}`].join(' '));

  readonly starFillState = computed<StarFillMode>(() => (this.selected() ? StarFillMode.Filled : StarFillMode.None));

  onClick(): void {
    if (this.clickStrategy() === ClickStrategy.Noop) return;
    this.toggleSelected();
  }
}
