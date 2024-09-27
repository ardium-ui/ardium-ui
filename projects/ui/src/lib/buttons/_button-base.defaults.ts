import { _focusableComponentDefaults, _FocusableComponentDefaults } from '../_internal/focusable-component';
import { ButtonType } from '../types/button.types';
import { ComponentColor } from './../types/colors.types';
import { ButtonAppearance } from './general-button.types';

export interface _SimpleButtonDefaults extends _FocusableComponentDefaults {
  color: ComponentColor;
  lightColoring: boolean;
  compact: boolean;
  type: ButtonType;
}
export const _simpleButtonDefaults: _SimpleButtonDefaults = {
  ..._focusableComponentDefaults,
  color: ComponentColor.Primary,
  lightColoring: false,
  compact: false,
  type: ButtonType.Button,
};
export interface _ButtonBaseDefaults extends _SimpleButtonDefaults {
  appearance: ButtonAppearance;
}
export const _buttonBaseDefaults: _ButtonBaseDefaults = {
  ..._simpleButtonDefaults,
  appearance: ButtonAppearance.Raised,
};
