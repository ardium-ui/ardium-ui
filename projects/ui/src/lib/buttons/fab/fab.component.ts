import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _ButtonBase } from '../_button-base';
import { FABSize } from '../general-button.types';
import { ARD_FAB_DEFAULTS } from './fab.defaults';

@Component({
  selector: 'ard-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumFabComponent extends _ButtonBase {
  protected override readonly _DEFAULTS = inject(ARD_FAB_DEFAULTS);
  
  //! appearance
  readonly size = input<FABSize>(FABSize.Standard);

  readonly extended = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-color-${this.color()}`,
      `ard-fab-size-${this.size()}`,
      this.lightColoring() ? `ard-light-coloring` : '',
      this.extended() ? 'ard-fab-extended' : '',
    ].join(' ')
  );
}
