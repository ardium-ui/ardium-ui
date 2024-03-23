import { ButtonAppearance } from '../buttons/general-button.types';
import { ComponentColor } from '../types/colors.types';
import { PanelAppearance, PanelVariant } from '../types/theming.types';

export const DialogResult = {
    Confirm: 'confirm',
    Reject: 'reject',
    Close: 'close',
} as const;
export type DialogResult = (typeof DialogResult)[keyof typeof DialogResult];

export type DialogButtonsContext = {
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
};
