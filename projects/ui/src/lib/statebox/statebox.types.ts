import { ComponentColor } from '../types/colors.types';

export type StateboxValue = string | boolean | number | null | undefined;

export interface StateboxState {
  value: StateboxValue;
  icon?: string;
  character?: string;
  color?: ComponentColor;
  customColor?: string;
  colorOnCustomColor?: string;
  fillMode?: boolean;
  keepFrame?: boolean;
}
export interface _StateboxInternalState {
  value: StateboxValue;
  display: string;
  displayAsIcon: boolean;
  color: string;
  useCustomColor: boolean;
  colorOnCustomColor?: string;
  fillMode: boolean;
  keepFrame: boolean;
}

export interface _StateboxInternalStateData {
  state: _StateboxInternalState;
  index: number;
}
