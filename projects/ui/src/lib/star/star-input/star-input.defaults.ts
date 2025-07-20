import { InjectionToken, Provider } from '@angular/core';
import { _ngModelComponentDefaults, _NgModelComponentDefaults } from '../../_internal/ngmodel-component';
import { StarColor } from '../star.types';

export interface ArdStarInputDefaults extends _NgModelComponentDefaults {
  color: StarColor;
  max: number;
}

const _starInputDefaults: ArdStarInputDefaults = {
  ..._ngModelComponentDefaults,
  color: StarColor.Gold,
  max: 5,
};

export const ARD_STAR_INPUT_DEFAULTS = new InjectionToken<ArdStarInputDefaults>('ard-star-input-defaults', {
  factory: () => ({
    ..._starInputDefaults,
  }),
});

export function provideStarInputDefaults(config: Partial<ArdStarInputDefaults>): Provider {
  return { provide: ARD_STAR_INPUT_DEFAULTS, useValue: { ..._starInputDefaults, ...config } };
}
