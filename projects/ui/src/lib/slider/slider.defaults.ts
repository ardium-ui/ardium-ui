import { InjectionToken, Provider } from '@angular/core';
import { _asbtractSliderDefaults, _AsbtractSliderDefaults } from './abstract-slider';

export interface ArdSliderDefaults extends _AsbtractSliderDefaults {}

const _sliderDefaults: ArdSliderDefaults = {
  ..._asbtractSliderDefaults,
};

export const ARD_SLIDER_DEFAULTS = new InjectionToken<ArdSliderDefaults>('ard-slider-defaults', {
  factory: () => ({
    ..._sliderDefaults,
  }),
});

export function provideSliderDefaults(config: Partial<ArdSliderDefaults>): Provider {
  return { provide: ARD_SLIDER_DEFAULTS, useValue: { ..._sliderDefaults, ...config } };
}
