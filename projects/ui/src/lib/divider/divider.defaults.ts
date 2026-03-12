import { InjectionToken, Provider } from '@angular/core';
import { OneAxisAlignmentOrientational } from '../types/alignment.types';
import { ArdDividerVariant } from './divider.types';

export interface ArdDividerDefaults {
  vertical: boolean;
  variant: ArdDividerVariant;
  flexItem: boolean;
  textAlign: OneAxisAlignmentOrientational;
}

const _dividerDefaults: ArdDividerDefaults = {
  vertical: false,
  variant: ArdDividerVariant.Full,
  flexItem: false,
  textAlign: OneAxisAlignmentOrientational.Center,
};

export const ARD_DIVIDER_DEFAULTS = new InjectionToken<ArdDividerDefaults>('ard-divider-defaults', {
  factory: () => ({
    ..._dividerDefaults,
  }),
});

export function provideDividerDefaults(config: Partial<ArdDividerDefaults>): Provider {
  return { provide: ARD_DIVIDER_DEFAULTS, useValue: { ..._dividerDefaults, ...config } };
}
