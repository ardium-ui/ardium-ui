import { InjectionToken } from '@angular/core';
import { PanelAppearance, PanelVariant } from './../types/theming.types';

export interface ArdModalDefaults {
  appearance: PanelAppearance;
  variant: PanelVariant;
  compact: boolean;
  heading: string;
  noCloseButton: boolean;
  noBackdrop: boolean;
  disableBackdropClose: boolean;
}

export const _modalComponentDefaults: ArdModalDefaults = {
  appearance: PanelAppearance.Raised,
  variant: PanelVariant.Rounded,
  compact: false,
  heading: '',
  noCloseButton: false,
  noBackdrop: false,
  disableBackdropClose: false,
};

export const ARD_MODAL_DEFAULTS = new InjectionToken<ArdModalDefaults>('ard-modal-defaults', {
  factory: () => ({
    ..._modalComponentDefaults,
  }),
});
