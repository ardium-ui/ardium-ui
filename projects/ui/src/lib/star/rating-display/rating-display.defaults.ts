import { InjectionToken, Provider } from '@angular/core';
import { StarColor } from '../star.types';

export interface ArdRatingDisplayDefaults {
  color: StarColor;
  max: number;
  value: number;
}

const _ratingDisplayDefaults: ArdRatingDisplayDefaults = {
  color: StarColor.Gold,
  max: 5,
  value: 0,
};

export const ARD_RATING_DISPLAY_DEFAULTS = new InjectionToken<ArdRatingDisplayDefaults>('ard-rating-display-defaults', {
  factory: () => ({
    ..._ratingDisplayDefaults,
  }),
});

export function provideRatingDisplayDefaults(config: Partial<ArdRatingDisplayDefaults>): Provider {
  return { provide: ARD_RATING_DISPLAY_DEFAULTS, useValue: { ..._ratingDisplayDefaults, ...config } };
}
