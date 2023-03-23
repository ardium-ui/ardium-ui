import { ArdOption } from "../_internal/item-storages/item-storage.types";
import { ArdOptionGroup } from './../_internal/item-storages/item-storage.types';


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
    totalItems: number;
    foundItems?: number;
    searchTerm: string;
}
```
 */
export interface SearchContext extends StatsContext {
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