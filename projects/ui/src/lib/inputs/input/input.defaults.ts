import { InjectionToken, Provider } from '@angular/core';
import { _simpleInputComponentDefaults, _SimpleInputComponentDefaults } from '../_simple-input-base';

export interface ArdInputDefaults extends _SimpleInputComponentDefaults {}

const _inputDefaults: ArdInputDefaults = {
  ..._simpleInputComponentDefaults,
};

export const ARD_SIMPLE_INPUT_DEFAULTS = new InjectionToken<ArdInputDefaults>('ard-input-defaults', {
  factory: () => ({
    ..._inputDefaults,
  }),
});

export function provideInputDefaults(config: Partial<ArdInputDefaults>): Provider {
  return { provide: ARD_SIMPLE_INPUT_DEFAULTS, useValue: { ..._inputDefaults, ...config } };
}
