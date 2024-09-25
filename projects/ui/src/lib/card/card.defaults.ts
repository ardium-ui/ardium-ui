import { InjectionToken } from '@angular/core';
import { OneAxisAlignment } from '@ardium-ui/ui';
import { CardAppearance, CardVariant } from './card.types';

export interface ArdCardDefaults {
  appearance: CardAppearance;
  variant: CardVariant;
  actionButtonsAlign: OneAxisAlignment;
}

export const ARD_CARD_DEFAULTS = new InjectionToken<ArdCardDefaults>('ard-card-defaults', {
  factory: () => ({
    appearance: CardAppearance.Raised,
    variant: CardVariant.Rounded,
    actionButtonsAlign: OneAxisAlignment.Right,
  }),
});
