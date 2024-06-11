import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../../_internal/focusable-component';
import { ComponentColor } from '../../types/colors.types';

@Component({
  selector: 'ard-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumIconButtonComponent extends _FocusableComponentBase {
  readonly wrapperClasses = input<string>('');

  //! button settings
  readonly color = input<ComponentColor>(ComponentColor.Primary);

  readonly lightColoring = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      'ard-appearance-transparent',
      `ard-color-${this.disabled() ? ComponentColor.None : this.color()}`,
      this.lightColoring() ? `ard-light-coloring` : '',
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );
}
