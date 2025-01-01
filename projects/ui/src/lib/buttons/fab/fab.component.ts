import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, computed, input } from '@angular/core';
import { _ButtonBase } from '../_button-base';
import { FabSize } from '../general-button.types';
import { ARD_FAB_DEFAULTS, ArdFabDefaults } from './fab.defaults';

@Component({
  selector: 'ard-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumFabComponent extends _ButtonBase {
  constructor(@Inject(ARD_FAB_DEFAULTS) defaults: ArdFabDefaults) {
    super(defaults);
  }
  
  //! appearance
  readonly size = input<FabSize>(FabSize.Standard);

  // readonly extended = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-color-${this.color()}`,
      `ard-fab-size-${this.size()}`,
      this.lightColoring() ? `ard-light-coloring` : '',
      // this.extended() ? 'ard-fab-extended' : '',
    ].join(' ')
  );
}
