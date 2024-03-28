import { Directive, Input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ButtonAppearance } from './general-button.types';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { ComponentColor } from '../types/colors.types';

@Directive()
export abstract class _ButtonBase extends _FocusableComponentBase {
  @Input() wrapperClasses: string = '';

  //* button settings
  @Input() appearance: ButtonAppearance = ButtonAppearance.Raised;
  @Input() color: ComponentColor = ComponentColor.Primary;

  private _lightColoring: boolean = false;
  @Input()
  get lightColoring(): boolean {
    return this._lightColoring;
  }
  set lightColoring(v: any) {
    this._lightColoring = coerceBooleanProperty(v);
  }

  private _compact: boolean = false;
  @Input()
  get compact(): boolean {
    return this._compact;
  }
  set compact(v: any) {
    this._compact = coerceBooleanProperty(v);
  }

  //* for adding classes to the button
  abstract get ngClasses(): string;
}
