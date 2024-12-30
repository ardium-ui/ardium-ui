import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentColor } from '../types/colors.types';
import { Nullable } from '../types/utility.types';
import { _BooleanComponentBase } from './../_internal/boolean-component';
import { ARD_SLIDE_TOGGLE_DEFAULTS, ArdSlideToggleDefaults } from './slide-toggle.defaults';
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
export class ArdiumSlideToggleComponent extends _BooleanComponentBase {
  protected override readonly _DEFAULTS!: ArdSlideToggleDefaults;
  constructor(@Inject(ARD_SLIDE_TOGGLE_DEFAULTS) defaults: ArdSlideToggleDefaults) {
    super(defaults);
  }

  readonly wrapperClass = input<Nullable<string>>(undefined);

  //! appearance
  readonly color = input<ComponentColor>(this._DEFAULTS.color);
  readonly appearance = input<ArdSlideToggleAppearance>(this._DEFAULTS.appearance);
  readonly icon = input<Nullable<string>>(this._DEFAULTS.icon);
  readonly selectedIcon = input<Nullable<string>>(this._DEFAULTS.selectedIcon);
  readonly unselectedIcon = input<Nullable<string>>(this._DEFAULTS.unselectedIcon);

  readonly ngClasses = computed(() => {
    return [`ard-color-${this.color()}`, `ard-appearance-${this.appearance()}`, this.wrapperClass() ?? ''].join(' ');
  });
}
