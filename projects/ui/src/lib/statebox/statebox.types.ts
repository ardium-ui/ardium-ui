import { ComponentColor } from '../types/colors.types';

export type StateboxValue = string | boolean | number | null | undefined;

export type StateboxState = {
  value: StateboxValue;
  icon?: string;
  character?: string;
  color?: ComponentColor;
  customColor?: string;
  colorOnCustomColor?: string;
  fillMode?: boolean;
  keepFrame?: boolean;
};
export type _StateboxInternalState = {
  value: StateboxValue;
  display: string;
  displayAsIcon: boolean;
  color: string;
  useCustomColor: boolean;
  colorOnCustomColor?: string;
  fillMode: boolean;
  keepFrame: boolean;
};
