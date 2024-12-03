import { InjectionToken } from '@angular/core';
import { _modalComponentDefaults, ArdModalDefaults } from '../modal/modal.defaults';
import { ButtonAppearance } from './../buttons/general-button.types';
import { ComponentColor } from './../types/colors.types';

export interface ArdDialogDefaults extends ArdModalDefaults {
  confirmButtonText: string;
  confirmButtonColor: ComponentColor;
  confirmButtonAppearance: ButtonAppearance;
  rejectButtonText: string;
  rejectButtonColor: ComponentColor;
  rejectButtonAppearance: ButtonAppearance;
  noRejectButton: boolean;
  canConfirm: boolean;
}

export const ARD_DIALOG_DEFAULTS = new InjectionToken<ArdDialogDefaults>('ard-dialog-defaults', {
  factory: () => ({
    ..._modalComponentDefaults,
    confirmButtonText: 'Confirm',
    confirmButtonColor: ComponentColor.Primary,
    confirmButtonAppearance: ButtonAppearance.RaisedStrong,
    rejectButtonText: 'Cancel',
    rejectButtonColor: ComponentColor.None,
    rejectButtonAppearance: ButtonAppearance.Transparent,
    noRejectButton: false,
    canConfirm: true,
  }),
});
