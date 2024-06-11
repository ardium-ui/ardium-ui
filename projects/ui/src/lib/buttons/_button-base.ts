import { Directive, Signal, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { ComponentColor } from '../types/colors.types';
import { ButtonAppearance } from './general-button.types';

@Directive()
export abstract class _ButtonBase extends _FocusableComponentBase {
  readonly wrapperClasses = input<string>('');

  //! button settings
  readonly appearance = input<ButtonAppearance>(ButtonAppearance.Raised);
  readonly color = input<ComponentColor>(ComponentColor.Primary);

  readonly lightColoring = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  abstract readonly ngClasses: Signal<string>;
}
