import { InjectionToken, Provider } from '@angular/core';
import { _ngModelComponentDefaults, _NgModelComponentDefaults } from '../_internal/ngmodel-component';
import { ClickStrategy } from './../types/utility.types';
import { StateboxState } from './statebox.types';

export interface ArdStateboxDefaults extends _NgModelComponentDefaults {
  clickStrategy: ClickStrategy;
  states: StateboxState[];
}

const _stateboxDefaults: ArdStateboxDefaults = {
  ..._ngModelComponentDefaults,
  clickStrategy: ClickStrategy.Default,
  states: [
    { value: false, color: 'none' },
    { value: true, color: 'secondary', icon: 'check_box', filled: true },
  ],
};

export const ARD_STATEBOX_DEFAULTS = new InjectionToken<ArdStateboxDefaults>('ard-statebox-defaults', {
  factory: () => ({
    ..._stateboxDefaults,
  }),
});

export function provideStateboxDefaults(config: Partial<ArdStateboxDefaults>): Provider {
  return { provide: ARD_STATEBOX_DEFAULTS, useValue: { ..._stateboxDefaults, ...config } };
}
