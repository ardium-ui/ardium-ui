import { InjectionToken, Provider } from '@angular/core';
import { ArdBreakpointsConfig } from '../breakpoints/breakpoints';
import { ArdGridAlign, ArdGridJustify, ArdGridSize, ArdGridWrap } from './grid.types';

export interface ArdGridDefaults {
  columns: number | string | ArdBreakpointsConfig<number>;
  size: number | string | ArdGridSize | ArdBreakpointsConfig<number | ArdGridSize>;
  reverse: boolean | string | ArdBreakpointsConfig<boolean>;
  justifyContent: ArdGridJustify | ArdBreakpointsConfig<ArdGridJustify>;
  alignItems: ArdGridAlign | ArdBreakpointsConfig<ArdGridAlign>;
  spacing: number | string | ArdBreakpointsConfig<number | string>;
  columnSpacing: null | number | string | ArdBreakpointsConfig<number | string>;
  rowSpacing: null | number | string | ArdBreakpointsConfig<number | string>;
  wrap: ArdGridWrap | ArdBreakpointsConfig<ArdGridWrap>;
}

const _gridDefaults: ArdGridDefaults = {
  columns: 12,
  size: ArdGridSize.Grow,
  reverse: false,
  justifyContent: ArdGridJustify.Start,
  alignItems: ArdGridAlign.Start,
  spacing: 3,
  columnSpacing: null,
  rowSpacing: null,
  wrap: ArdGridWrap.Wrap,
};

export const ARD_GRID_DEFAULTS = new InjectionToken<ArdGridDefaults>('ard-grid-defaults', {
  factory: () => ({
    ..._gridDefaults,
  }),
});

export function provideGridDefaults(config: Partial<ArdGridDefaults>): Provider {
  return { provide: ARD_GRID_DEFAULTS, useValue: { ..._gridDefaults, ...config } };
}
