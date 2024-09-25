import { InjectionToken } from '@angular/core';
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

export const ARD_BADGE_DEFAULTS = new InjectionToken<ArdBadgeDefaults>('ard-badge-defaults', {
  factory: () => ({
    color: ComponentColor.Primary,
    variant: FormElementVariant.Rounded,
    size: BadgeSize.Medium,
    position: BadgePosition.AboveAfter,
    overlap: false,
  }),
});
