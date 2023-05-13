
/**
```typescript
interface OptionContext {
    $implicit: ArdOption;
    item: ArdOption;
    itemData: any;
}
```
 */
export interface OptionContext {
    $implicit: ArdOption;
    item: ArdOption;
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
    readonly itemData: any;
    readonly index: number;
    value: any;
    label: string;
    disabled?: boolean;
    selected?: boolean;
    highlighted?: boolean;
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
    disabled?: boolean;
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
    readonly group?: any;
    highlighted_recently?: boolean;
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
    label: string;
    disabled?: boolean;
    highlighted?: boolean;
    selected?: boolean;
    children: ArdOption[];
}

export const ArdPanelPosition = {
    Top: 'top',
    Bottom: 'bottom',
    Auto: 'auto',
} as const;
export type ArdPanelPosition = typeof ArdPanelPosition[keyof typeof ArdPanelPosition];

export type ArdItemGroupMap = Map<any, ArdOptionGroup>;

export type GroupByFn = (item: any) => any;
export type SearchFn = (searchTerm: string, item: ArdOption) => boolean;
export type CompareWithFn = (value: any, optionValue: any) => boolean;