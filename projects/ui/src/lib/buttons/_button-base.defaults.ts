import { ButtonType } from '../types/button.types';
import { ComponentColor } from './../types/colors.types';
import { ButtonAppearance } from './general-button.types';

export interface _SimpleButtonDefaults {
  disabled: boolean;
  tabIndex: number;
  color: ComponentColor;
  lightColoring: boolean;
  compact: boolean;
  type: ButtonType;
  pointerEventsWhenDisabled: boolean;
}
export const _simpleButtonDefaults: _SimpleButtonDefaults = {
  disabled: false,
  tabIndex: 0,
  color: ComponentColor.Primary,
  lightColoring: false,
  compact: false,
  type: ButtonType.Button,
  pointerEventsWhenDisabled: false,
};
export interface _ButtonBaseDefaults extends _SimpleButtonDefaults {
  appearance: ButtonAppearance;
}
export const _buttonBaseDefaults: _ButtonBaseDefaults = {
  ..._simpleButtonDefaults,
  appearance: ButtonAppearance.Raised,
};
