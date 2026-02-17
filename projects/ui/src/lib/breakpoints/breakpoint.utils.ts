import { coerceNumberProperty } from '@ardium-ui/devkit';
import { isNull, isNumber } from 'simple-bool';
import { ArdGridSize, isArdGridSize } from '../grid';
import { fillInMissingBreakpoints, transformResponsiveValue } from '../grid/grid.utils';
import { ArdBreakpointsConfig } from './breakpoints';

export function parseNumberOrBreakpointConfig(
  value: number | string | ArdBreakpointsConfig<number>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<number>> {
  if (typeof value === 'number') {
    // If it's a number, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  return transformResponsiveValue<number>(value, breakpoints, coerceNumberProperty);
}

export function parseSizeOrBreakpointConfig(
  value: number | ArdGridSize | string | ArdBreakpointsConfig<number | ArdGridSize>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<number | ArdGridSize>> {
  if (typeof value === 'number' || isArdGridSize(value)) {
    // If it's a number or ArdGridSize, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  return transformResponsiveValue<number | ArdGridSize>(value, breakpoints, v => {
    if (isArdGridSize(v)) {
      return v;
    }
    return coerceNumberProperty(v);
  });
}

export function parseBooleanOrBreakpointConfig(
  value: boolean | string | ArdBreakpointsConfig<boolean>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<boolean>> {
  if (typeof value === 'boolean') {
    // If it's a boolean, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  if (value === '' || value === 'true') {
    return fillInMissingBreakpoints({ xs: true }, breakpoints);
  }
  return transformResponsiveValue<boolean>(value, breakpoints, v => v === 'true');
}

export function parseCSSUnitOrBreakpointConfig(
  value: null | number | string | ArdBreakpointsConfig<string | number>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<string>> | null {
  if (isNull(value)) {
    return value;
  }
  if (isNumber(value)) {
    fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  return transformResponsiveValue<string | number, string>(value, breakpoints, v => {
    const num = coerceNumberProperty(v, NaN);
    return isNaN(num) ? v : `calc(var(--ard-grid-spacing-unit) * ${num})`;
  });
}

export function parseEnumOrBreakpointConfig<T>(
  value: T | string | ArdBreakpointsConfig<T>,
  breakpoints: string[],
  isEnumValue: (val: any) => val is T
): Required<ArdBreakpointsConfig<T>> {
  if (isEnumValue(value)) {
    // If it's an enum value, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value as T }, breakpoints);
  }
  return transformResponsiveValue<T>(value, breakpoints, v => (isEnumValue(v) ? v : undefined));
}
