import { InjectionToken, Provider } from '@angular/core';
import { OneAxisAlignment } from './../types/alignment.types';
import { CardAppearance, CardVariant } from './card.types';

export interface ArdCardDefaults {
  appearance: CardAppearance;
  variant: CardVariant;
  actionButtonsAlign: OneAxisAlignment;
}

const _cardDefaults: ArdCardDefaults = {
  appearance: CardAppearance.Raised,
  variant: CardVariant.Rounded,
  actionButtonsAlign: OneAxisAlignment.Right,
};

export const ARD_CARD_DEFAULTS = new InjectionToken<ArdCardDefaults>('ard-card-defaults', {
  factory: () => ({
    ..._cardDefaults,
  }),
});

export function provideCardDefaults(config: Partial<ArdCardDefaults>): Provider {
  return { provide: ARD_CARD_DEFAULTS, useValue: { ..._cardDefaults, ...config } };
}
