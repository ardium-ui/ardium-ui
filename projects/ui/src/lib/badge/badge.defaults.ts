import { InjectionToken, Provider } from '@angular/core';
import { ComponentColor } from './../types/colors.types';
import { FormElementVariant } from './../types/theming.types';
import { BadgePosition, BadgeSize } from './badge.types';

export interface ArdBadgeDefaults {
  color: ComponentColor;
  variant: FormElementVariant;
  size: BadgeSize;
  position: BadgePosition;
  overlap: boolean;
}

const _badgeDefaults: ArdBadgeDefaults = {
  color: ComponentColor.Primary,
  variant: FormElementVariant.Rounded,
  size: BadgeSize.Medium,
  position: BadgePosition.AboveAfter,
  overlap: false,
};

export const ARD_BADGE_DEFAULTS = new InjectionToken<ArdBadgeDefaults>('ard-badge-defaults', {
  factory: () => ({
    ..._badgeDefaults,
  }),
});

export function provideBadgeDefaults(config: Partial<ArdBadgeDefaults>): Provider {
  return { provide: ARD_BADGE_DEFAULTS, useValue: { ..._badgeDefaults, ...config } };
}
