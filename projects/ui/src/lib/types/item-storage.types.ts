import { Signal, WritableSignal } from "@angular/core";
import { Nullable } from "./utility.types";

/**
```typescript
interface OptionContext {
    $implicit: ArdOption;
    item: ArdOption;
    itemData: any;
}
```
 */
export interface OptionContext<T extends ArdSimplestStorageItem> {
  $implicit: T;
  item: T;
  itemData: any;
}

/**
```typescript
interface ArdOption {
    readonly itemData: any;
    readonly index: number;
    label: string;
    value: any;
    highlighted?: boolean;
    selected?: boolean;
}
```
 */
export interface ArdSimplestStorageItem {
  readonly itemData: WritableSignal<any>;
  readonly index: Signal<number>;
  readonly value: WritableSignal<any>;
  readonly label: WritableSignal<string>;
  readonly selected: WritableSignal<Nullable<boolean>>;
  readonly highlighted: WritableSignal<Nullable<boolean>>;
}

/**
```typescript
interface ArdOption {
    readonly itemData: any;
    readonly index: number;
    readonly label: string;
    readonly value: any;
    disabled?: boolean;
    highlighted?: boolean;
    selected?: boolean;
}
```
 */
export interface ArdOptionSimple extends ArdSimplestStorageItem {
  readonly disabled: WritableSignal<Nullable<boolean>>;
}
/**
```typescript
interface ArdOption {
    readonly itemData: any;
    readonly index: number;
    readonly label: string;
    readonly value: any;
    readonly group?: any;
    disabled?: boolean;
    selected?: boolean;
    highlighted?: boolean;
    highlighted_recently?: boolean;
}
```
 */
export interface ArdOption extends ArdOptionSimple {
  readonly group: Signal<any>;
  readonly highlighted_recently: WritableSignal<Nullable<boolean>>;
}

/**
```typescript
interface ArdItemGroup {
    label: string;
    disabled?: boolean;
    highlighted?: boolean;
    selected?: boolean;
    children: ArdOption[];
}
```
 */
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
