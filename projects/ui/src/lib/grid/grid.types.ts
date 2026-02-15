//! size
export const ArdGridSize = {
  Grow: 'grow',
  Auto: 'auto',
} as const;
export type ArdGridSize = (typeof ArdGridSize)[keyof typeof ArdGridSize];

const gridSizeValuesSet = new Set(Object.values(ArdGridSize));

export function isArdGridSize(value: any): value is ArdGridSize {
  return gridSizeValuesSet.has(value);
}

//! justify
export const ArdGridJustify = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
  SpaceBetween: 'space-between',
  SpaceAround: 'space-around',
  SpaceEvenly: 'space-evenly',
} as const;
export type ArdGridJustify = (typeof ArdGridJustify)[keyof typeof ArdGridJustify];

const gridJustifyValuesSet = new Set(Object.values(ArdGridJustify));

export function isArdGridJustify(value: any): value is ArdGridJustify {
  return gridJustifyValuesSet.has(value);
}

//! align
export const ArdGridAlign = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
} as const;
export type ArdGridAlign = (typeof ArdGridAlign)[keyof typeof ArdGridAlign];

const gridAlignValuesSet = new Set(Object.values(ArdGridAlign));

export function isArdGridAlign(value: any): value is ArdGridAlign {
  return gridAlignValuesSet.has(value);
}

//! wrap
export const ArdGridWrap = {
  Wrap: 'wrap',
  NoWrap: 'nowrap',
  WrapReverse: 'wrap-reverse',
} as const;
export type ArdGridWrap = (typeof ArdGridWrap)[keyof typeof ArdGridWrap];

const gridWrapValuesSet = new Set(Object.values(ArdGridWrap));

export function isArdGridWrap(value: any): value is ArdGridWrap {
  return gridWrapValuesSet.has(value);
}
