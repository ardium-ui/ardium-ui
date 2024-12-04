import { Directive, input, Signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBaseWithDefaults } from '../_internal/focusable-component';
import { ButtonType } from '../types/button.types';
import { ComponentColor } from '../types/colors.types';
import { _ButtonBaseDefaults } from './_button-base.defaults';
import { ButtonAppearance } from './general-button.types';

@Directive()
export abstract class _ButtonBase extends _FocusableComponentBaseWithDefaults {
  readonly wrapperClasses = input<string>('');

  protected override readonly _DEFAULTS!: _ButtonBaseDefaults;

  constructor(defaults: _ButtonBaseDefaults) {
    super(defaults);
    this._DEFAULTS = defaults;
  }

  readonly type = input<ButtonType>(this._DEFAULTS.type);

  //! button settings
  readonly appearance = input<ButtonAppearance>(this._DEFAULTS.appearance);
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly lightColoring = input<boolean, any>(this._DEFAULTS.lightColoring, { transform: v => coerceBooleanProperty(v) });
  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  abstract readonly ngClasses: Signal<string>;
}
