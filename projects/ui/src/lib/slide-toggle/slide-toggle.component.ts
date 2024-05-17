import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, computed, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentColor } from '../types/colors.types';
import { _BooleanComponentBase } from './../_internal/boolean-component';
import { ArdSlideToggleAppearance } from './slide-toggle.types';

@Component({
  selector: 'ard-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumSlideToggleComponent),
      multi: true,
    },
  ],
})
export class ArdiumSlideToggleComponent extends _BooleanComponentBase implements ControlValueAccessor {
  readonly wrapperClass = input<string | undefined | null>(undefined);

  //! appearance
  readonly color = input<ComponentColor>(ComponentColor.Primary);
  readonly appearance = input<ArdSlideToggleAppearance>(ArdSlideToggleAppearance.Raised);
  readonly icon = input<string | undefined | null>(undefined);
  readonly selectedIcon = input<string | undefined | null>(undefined);
  readonly unselectedIcon = input<string | undefined | null>(undefined);

  readonly ngClasses = computed(() => {
    return [`ard-color-${this.color()}`, `ard-appearance-${this.appearance()}`, this.wrapperClass() ?? ''].join(' ');
  });
}
