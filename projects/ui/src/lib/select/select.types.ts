import { ArdOption, ArdOptionGroup, OptionContext } from '../types/item-storage.types';

export type AddCustomFn<T> = (value: string) => T;

export interface ValueContext extends OptionContext<ArdOption> {
  unselect: () => void;
}

export interface PlaceholderContext {
  placeholder: string;
  $implicit: string;
}

export interface StatsContext {
  totalItems: number;
  foundItems?: number;
}

export interface SearchContext extends StatsContext {
  $implicit: string;
  searchTerm: string;
}

export interface CustomOptionContext {
  $implicit: string;
  searchTerm: string;
}

export interface GroupContext {
  $implicit: ArdOptionGroup;
  group: ArdOptionGroup;
  label: string;
  disabled: boolean;
  selectedChildrenCount: number;
  totalChildrenCount: number;
}

export interface ItemLimitContext {
  totalItems: number;
  selectedItems: number;
  itemLimit?: number;
}

export interface ItemDisplayLimitContext extends ItemLimitContext {
  overflowCount: number;
}
