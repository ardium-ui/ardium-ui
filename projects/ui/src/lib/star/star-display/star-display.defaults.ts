import { InjectionToken, Provider } from '@angular/core';
import { StarColor } from '../star.types';

export interface ArdStarDisplayDefaults {
  color: StarColor;
  max: number;
  value: number;
}

const _starDisplayDefaults: ArdStarDisplayDefaults = {
  color: StarColor.Star,
  max: 5,
  value: 0,
};

export const ARD_STAR_DISPLAY_DEFAULTS = new InjectionToken<ArdStarDisplayDefaults>('ard-star-display-defaults', {
  factory: () => ({
    ..._starDisplayDefaults
  }),
});

export function provideStarDisplayDefaults(config: Partial<ArdStarDisplayDefaults>): Provider {
  return { provide: ARD_STAR_DISPLAY_DEFAULTS, useValue: { ..._starDisplayDefaults, ...config } };
}