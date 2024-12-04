import { InjectionToken, Provider } from '@angular/core';
import { FormElementAppearance } from '../types/theming.types';

export interface ArdKbdShortcutDefaults {
  full?: boolean;
  appearance?: FormElementAppearance;
}

export const ARD_KBD_SHORTCUT_DEFAULTS = new InjectionToken<ArdKbdShortcutDefaults>('ard-kbd-shortcut-defaults', {
  factory: () => ({}),
});

export function provideKbdShortcutDefaults(config: Partial<ArdKbdShortcutDefaults>): Provider {
  return { provide: ARD_KBD_SHORTCUT_DEFAULTS, useValue: config };
}
