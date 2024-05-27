import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, computed, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { _ButtonBase } from '../_button-base';
import { ButtonVariant } from '../general-button.types';

@Component({
  selector: 'ard-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumButtonComponent extends _ButtonBase {
  readonly icon = input<string>('');
  
  //! button settings
  readonly variant = input<ButtonVariant>(ButtonVariant.Rounded);
  readonly alignIcon = input<SimpleOneAxisAlignment>(SimpleOneAxisAlignment.Left);

  readonly vertical = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      this.wrapperClasses(),
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-color-${this.color()}`,
      `ard-align-${this.alignIcon()}`,
      this.lightColoring() ? `ard-light-coloring` : '',
      this.compact() ? 'ard-compact' : '',
      this.vertical() ? 'ard-button-vertical' : '',
    ].join(' ')
  );
}
