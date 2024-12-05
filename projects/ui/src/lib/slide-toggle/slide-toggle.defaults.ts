import { InjectionToken, Provider } from '@angular/core';
import { _booleanComponentDefaults, _BooleanComponentDefaults } from '../_internal/boolean-component';
import { Nullable } from '../types/utility.types';
import { ComponentColor } from './../types/colors.types';
import { ArdSlideToggleAppearance } from './slide-toggle.types';

export interface ArdSlideToggleDefaults extends _BooleanComponentDefaults {
  color: ComponentColor;
  appearance: ArdSlideToggleAppearance;
  icon: Nullable<string>;
  selectedIcon: Nullable<string>;
  unselectedIcon: Nullable<string>;
}

const _slideToggleDefaults: ArdSlideToggleDefaults = {
  ..._booleanComponentDefaults,
  color: ComponentColor.Primary,
  appearance: ArdSlideToggleAppearance.Raised,
  icon: undefined,
  selectedIcon: undefined,
  unselectedIcon: undefined,
};

export const ARD_SLIDE_TOGGLE_DEFAULTS = new InjectionToken<ArdSlideToggleDefaults>('ard-slide-toggle-defaults', {
  factory: () => ({
    ..._slideToggleDefaults,
  }),
});

export function provideSlideToggleDefaults(config: Partial<ArdSlideToggleDefaults>): Provider {
  return { provide: ARD_SLIDE_TOGGLE_DEFAULTS, useValue: { ..._slideToggleDefaults, ...config } };
}
