import { InjectionToken, Provider } from '@angular/core';
import { FormElementAppearance } from './../types/theming.types';

export interface ArdKbdDefaults {
  full: boolean;
  appearance: FormElementAppearance;
}

const _kbdDefaults: ArdKbdDefaults = {
  full: false,
  appearance: FormElementAppearance.Outlined,
};

export const ARD_KBD_DEFAULTS = new InjectionToken<ArdKbdDefaults>('ard-kbd-defaults', {
  factory: () => ({
    ..._kbdDefaults,
  }),
});

export function provideKbdDefaults(config: Partial<ArdKbdDefaults>): Provider {
  return { provide: ARD_KBD_DEFAULTS, useValue: { ..._kbdDefaults, ...config } };
}
