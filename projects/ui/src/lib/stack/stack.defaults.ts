import { InjectionToken, Provider } from '@angular/core';
import { ArdBreakpointsConfig } from '../breakpoints';
import { ArdGridAlign, ArdGridDirection, ArdGridJustify, ArdGridWrap } from '../grid';

export interface ArdStackDefaults {
  direction: ArdGridDirection | ArdBreakpointsConfig<ArdGridDirection>;
  justifyContent: ArdGridJustify | ArdBreakpointsConfig<ArdGridJustify>;
  alignItems: ArdGridAlign | ArdBreakpointsConfig<ArdGridAlign>;
  spacing: number | string | ArdBreakpointsConfig<number | string>;
  columnSpacing: null | number | string | ArdBreakpointsConfig<number | string>;
  rowSpacing: null | number | string | ArdBreakpointsConfig<number | string>;
  wrap: ArdGridWrap | ArdBreakpointsConfig<ArdGridWrap>;
}

const _stackDefaults: ArdStackDefaults = {
  direction: ArdGridDirection.Column,
  justifyContent: ArdGridJustify.Start,
  alignItems: ArdGridAlign.Start,
  spacing: 3,
  columnSpacing: null,
  rowSpacing: null,
  wrap: ArdGridWrap.Wrap,
};

export const ARD_STACK_DEFAULTS = new InjectionToken<ArdStackDefaults>('ard-stack-defaults', {
  factory: () => ({
    ..._stackDefaults,
  }),
});

export function provideStackDefaults(config: Partial<ArdStackDefaults>): Provider {
  return { provide: ARD_STACK_DEFAULTS, useValue: { ..._stackDefaults, ...config } };
}
