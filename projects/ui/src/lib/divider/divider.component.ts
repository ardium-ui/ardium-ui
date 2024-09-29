import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ARD_DIVIDER_DEFAULTS } from './divider.defaults';

@Component({
  selector: 'ard-divider',
  template: '',
  styleUrls: ['./divider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ard-divider-vertical]': 'vertical()',
  },
})
export class ArdiumDividerComponent {
  protected readonly _DEFAULTS = inject(ARD_DIVIDER_DEFAULTS);

  readonly vertical = input<boolean, any>(this._DEFAULTS.vertical, { transform: v => coerceBooleanProperty(v) });
}
