import { ButtonAppearance } from '../buttons/general-button.types';
import { ComponentColor } from '../types/colors.types';
import { PanelAppearance, PanelVariant } from '../types/theming.types';

export const ArdDialogResult = {
  Confirm: 'confirm',
  Reject: 'reject',
  Close: 'close',
} as const;
export type ArdDialogResult = (typeof ArdDialogResult)[keyof typeof ArdDialogResult];

export const ArdDialogActionType = {
  NoOp: 'no-op',
  AutoClose: 'autoclose',
} as const;
export type ArdDialogActionType = typeof ArdDialogActionType[keyof typeof ArdDialogActionType];

export interface DialogButtonsContext {
  confirmButton: {
    text: string;
    color: ComponentColor;
    appearance: ButtonAppearance;
  };
  rejectButton: {
    enabled: boolean;
    text: string;
    color: ComponentColor;
    appearance: ButtonAppearance;
  };
  canConfirm: boolean;
  onConfirm: () => void;
  onReject: () => void;
  dialogAppearance: PanelAppearance;
  dialogVariant: PanelVariant;
  dialogCompact: boolean;
}
