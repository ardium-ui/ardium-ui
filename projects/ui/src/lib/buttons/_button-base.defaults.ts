import { ButtonType } from '../types/button.types';
import { ComponentColor } from './../types/colors.types';
import { ButtonAppearance } from './general-button.types';

export interface _SimpleButtonDefaults {
  color: ComponentColor;
  lightColoring: boolean;
  compact: boolean;
}
export const _simpleButtonDefaults: _SimpleButtonDefaults = {
  color: ComponentColor.Primary,
  lightColoring: false,
  compact: false,
};
export interface _ButtonBaseDefaults extends _SimpleButtonDefaults {
  appearance: ButtonAppearance;
  type: ButtonType;
}
export const _buttonBaseDefaults: _ButtonBaseDefaults = {
  ..._simpleButtonDefaults,
  appearance: ButtonAppearance.Raised,
  type: ButtonType.Button,
};
