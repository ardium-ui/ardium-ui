import { InjectionToken, Provider } from '@angular/core';
import { ArdiumTooltipAlign, ArdiumTooltipPosition } from './tooltip.types';

export interface ArdTooltipDefaults {
  disabled: boolean;
  showDelay: number;
  hideDelay: number;
  position: ArdiumTooltipPosition;
  align: ArdiumTooltipAlign;
  panelClass?: string;
  cardPanel: boolean;
  withArrow: boolean;
}

const _tooltipDefaults: ArdTooltipDefaults = {
  disabled: false,
  showDelay: 0,
  hideDelay: 0,
  position: ArdiumTooltipPosition.Top,
  align: ArdiumTooltipAlign.Center,
  panelClass: undefined,
  cardPanel: false,
  withArrow: false,
};

export const ARD_TOOLTIP_DEFAULTS = new InjectionToken<ArdTooltipDefaults>('ard-tooltip-defaults', {
  factory: () => ({
    ..._tooltipDefaults,
  }),
});

export function provideTooltipDefaults(config: Partial<ArdTooltipDefaults>): Provider {
  return { provide: ARD_TOOLTIP_DEFAULTS, useValue: { ..._tooltipDefaults, ...config } };
}
