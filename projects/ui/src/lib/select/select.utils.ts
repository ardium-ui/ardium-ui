import { Nullable } from '../types/utility.types';

const NUMBER_REGEX = /^\d+$/;

export function transformDropdownPanelSize(v: Nullable<number | string>): Nullable<number | string> {
  if (typeof v === 'string' && NUMBER_REGEX.test(v)) {
    return Number(v);
  }
  return v;
}
