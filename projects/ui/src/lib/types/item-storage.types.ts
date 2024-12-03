import { WritableSignal } from '@angular/core';
import { Nullable } from './utility.types';

export interface OptionContext<T extends ArdSimplestStorageItem> {
  $implicit: T;
  item: T;
  itemData: any;
}

export interface ArdSimplestStorageItem {
  readonly itemData: WritableSignal<any>;
  readonly index: number;
  readonly value: WritableSignal<any>;
  readonly label: WritableSignal<string>;
  readonly selected: WritableSignal<Nullable<boolean>>;
  readonly highlighted: WritableSignal<Nullable<boolean>>;
}

export interface ArdOptionSimple extends ArdSimplestStorageItem {
  readonly disabled: WritableSignal<Nullable<boolean>>;
}

export interface ArdOption extends ArdOptionSimple {
  readonly group: unknown;
  readonly highlighted_recently: WritableSignal<Nullable<boolean>>;
}

export interface ArdOptionGroup {
  readonly label: WritableSignal<string>;
  readonly disabled: WritableSignal<Nullable<boolean>>;
  readonly highlighted: WritableSignal<Nullable<boolean>>;
  readonly selected: WritableSignal<Nullable<boolean>>;
  readonly children: WritableSignal<ArdOption[]>;
}

export const ArdPanelPosition = {
  Top: 'top',
  Bottom: 'bottom',
  Auto: 'auto',
} as const;
export type ArdPanelPosition = (typeof ArdPanelPosition)[keyof typeof ArdPanelPosition];

export type ArdItemGroupMap = Map<any, ArdOptionGroup>;

export type GroupByFn = (item: any) => any;
export type SearchFn = (searchTerm: string, item: ArdOption) => boolean;
export type CompareWithFn = (value: any, optionValue: any) => boolean;
