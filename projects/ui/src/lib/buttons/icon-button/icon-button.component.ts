import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../../_internal/focusable-component';
import { ButtonType } from '../../types/button.types';
import { ComponentColor } from '../../types/colors.types';
import { ARD_ICON_BUTTON_DEFAULTS } from './icon-button.defaults';

@Component({
  selector: 'ard-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumIconButtonComponent extends _FocusableComponentBase {
  readonly wrapperClasses = input<string>('');

  protected override readonly _DEFAULTS = inject(ARD_ICON_BUTTON_DEFAULTS);

  readonly type = input<ButtonType>(this._DEFAULTS.type);

  //! button settings
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly lightColoring = input<boolean, any>(this._DEFAULTS.lightColoring, { transform: v => coerceBooleanProperty(v) });
  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      'ard-appearance-transparent',
      `ard-color-${this.disabled() ? ComponentColor.None : this.color()}`,
      this.lightColoring() ? `ard-light-coloring` : '',
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );
}
