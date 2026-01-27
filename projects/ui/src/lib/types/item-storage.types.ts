
export type OptionContext<T extends ArdSimplestStorageItem> = {
  $implicit: T;
  item: T;
} & {
  [K in keyof Omit<T, 'filtered'>]: T[K];
}

export interface ArdSimplestStorageItem {
  readonly itemData: object;
  readonly index: number;
  readonly value: any;
  readonly label: string;
  readonly selected: boolean;
  readonly highlighted: boolean;
}

export interface ArdOptionSimple extends ArdSimplestStorageItem {
  readonly disabled: boolean;
}

export interface ArdOption extends ArdOptionSimple {
  readonly filtered: boolean;
  readonly isExactMatch: boolean;
  readonly group: unknown;
  readonly highlighted_recently: boolean;
}

export interface ArdOptionGroup {
  readonly label: string;
  readonly disabled: boolean;
  readonly children: ArdOption[];
}

export const ArdPanelPosition = {
  Top: 'top',
  Bottom: 'bottom',
  Auto: 'auto',
} as const;
export type ArdPanelPosition = (typeof ArdPanelPosition)[keyof typeof ArdPanelPosition];

export type ArdItemGroupMap = Map<any, ArdOptionGroup>;

export type GroupByFn = (item: any) => any;
export type SearchFn = (searchTerm: string, item: ArdOption) => [boolean, boolean];
export type CompareWithFn = (value: any, optionValue: any) => boolean;
