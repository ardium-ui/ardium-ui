import { InjectionToken, Provider } from '@angular/core';

export interface ArdButtonGroupDefaults {
  vertical: boolean;
  compact: boolean;
}

const _buttonGroupDefaults: ArdButtonGroupDefaults = {
  vertical: false,
  compact: false,
};

export const ARD_BUTTON_GROUP_DEFAULTS = new InjectionToken<ArdButtonGroupDefaults>('ard-button-group-defaults', {
  factory: () => ({ ..._buttonGroupDefaults }),
});

export function provideButtonGroupDefaults(config: Partial<ArdButtonGroupDefaults>): Provider {
  return { provide: ARD_BUTTON_GROUP_DEFAULTS, useValue: { ..._buttonGroupDefaults, ...config } };
}
