import { InjectionToken, Provider } from '@angular/core';
import { _ngModelComponentDefaults, _NgModelComponentDefaults } from '../../_internal/ngmodel-component';
import { StarColor } from '../star.types';

export interface ArdRatingInputDefaults extends _NgModelComponentDefaults {
  color: StarColor;
  max: number;
}

const _ratingInputDefaults: ArdRatingInputDefaults = {
  ..._ngModelComponentDefaults,
  color: StarColor.Gold,
  max: 5,
};

export const ARD_RATING_INPUT_DEFAULTS = new InjectionToken<ArdRatingInputDefaults>('ard-rating-input-defaults', {
  factory: () => ({
    ..._ratingInputDefaults,
  }),
});

export function provideRatingInputDefaults(config: Partial<ArdRatingInputDefaults>): Provider {
  return { provide: ARD_RATING_INPUT_DEFAULTS, useValue: { ..._ratingInputDefaults, ...config } };
}
