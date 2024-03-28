import { ArdOption, OptionContext } from '../types/item-storage.types';
import { ArdOptionGroup } from '../types/item-storage.types';

export type AddCustomFn<T> = (value: string) => T;

/**
```typescript
interface ValueContext {
    $implicit: ArdOption;
    item: ArdOption;
    itemData: any;
    unselect: () => void;
}
```
 */
export interface ValueContext extends OptionContext {
  unselect: () => void;
}
/**
```typescript
interface PlaceholderContext {
    placeholder: string;
    $implicit: string;
}
```
 */
export interface PlaceholderContext {
  placeholder: string;
  $implicit: string;
}
/**
```typescript
interface StatsContext {
    totalItems: number;
    foundItems?: number;
}
```
 */
export interface StatsContext {
  totalItems: number;
  foundItems?: number;
}
/**
```typescript
interface SearchContext {
    $implicit: string;
    totalItems: number;
    foundItems?: number;
    searchTerm: string;
}
```
 */
export interface SearchContext extends StatsContext {
  $implicit: string;
  searchTerm: string;
}
/**
```typescript
interface SearchContext {
    $implicit: string;
    searchTerm: string;
}
```
 */
export interface CustomOptionContext {
  $implicit: string;
  searchTerm: string;
}
/**
```typescript
interface GroupContext {
    $implicit: ArdOptionGroup;
    group: ArdOptionGroup;
    selectedChildren: number;
    totalChildren: number;
}
```
 */
export interface GroupContext {
  $implicit: ArdOptionGroup;
  group: ArdOptionGroup;
  selectedChildren: number;
  totalChildren: number;
}
/**
```typescript
interface ItemLimitContext {
    totalItems: number;
    selectedItems: number;
    itemLimit?: number;
}
```
 */
export interface ItemLimitContext {
  totalItems: number;
  selectedItems: number;
  itemLimit?: number;
}
/**
```typescript
interface ItemDisplayLimitContext {
    totalItems: number;
    selectedItems: number;
    itemLimit?: number;
    overflowCount: number;
}
```
 */
export interface ItemDisplayLimitContext extends ItemLimitContext {
  overflowCount: number;
}
