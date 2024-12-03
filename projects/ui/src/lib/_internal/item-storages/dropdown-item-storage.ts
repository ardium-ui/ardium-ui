import { Signal, computed, signal } from '@angular/core';
import { resolvePath } from 'resolve-object-path';
import { any, evaluate, isArray, isDefined, isObject, isPrimitive, isPromise } from 'simple-bool';
import { AddCustomFn } from '../../select/select.types';
import { ArdItemGroupMap, ArdOption, ArdOptionGroup, CompareWithFn, GroupByFn, SearchFn } from '../../types/item-storage.types';
import { Nullable } from '../../types/utility.types';

export interface ItemStorageHostDefaults {
  valueFrom: string;
  labelFrom: string;
  disabledFrom: string;
  groupLabelFrom: string;
  groupDisabledFrom: string;
  childrenFrom: string;
  [key: string]: any;
}
export interface ItemStorageHost {
  readonly valueFrom: Signal<Nullable<string>>;
  readonly labelFrom: Signal<Nullable<string>>;
  readonly disabledFrom: Signal<Nullable<string>>;
  readonly invertDisabled: Signal<Nullable<boolean>>;
  readonly groupLabelFrom: Signal<Nullable<string | GroupByFn>>;
  readonly groupDisabledFrom: Signal<Nullable<string>>;
  readonly childrenFrom: Signal<Nullable<string>>;
  readonly DEFAULTS: ItemStorageHostDefaults;
  readonly itemsAlreadyGrouped: Signal<Nullable<boolean>>;
  readonly hideSelected: Signal<boolean>;
  readonly searchCaseSensitive: Signal<boolean>;
  readonly searchFn: Signal<SearchFn>;
  readonly compareWith: Signal<Nullable<CompareWithFn>>;
  readonly multiselectable: Signal<boolean>;
  readonly sortMultipleValues: Signal<boolean>;
  readonly maxSelectedItems: Signal<Nullable<number>>;
  readonly addCustom: Signal<boolean | AddCustomFn<any> | AddCustomFn<Promise<any>>>;
  readonly _componentId: string;
}

export class ItemStorage {
  private readonly _groups = signal<ArdItemGroupMap>(this._createEmptyGroupMap());
  private readonly _items = signal<ArdOption[]>([]);
  private readonly _filteredItems = signal<ArdOption[]>([]);
  private readonly _highlightedItems = signal<ArdOption[]>([]);
  private readonly _highlightedGroups = signal<ArdOptionGroup[]>([]);
  private readonly _recentlyHighlightedItem = signal<Nullable<ArdOption>>(undefined);
  private readonly _selectedItems = signal<ArdOption[]>([]);

  constructor(private readonly _ardParentComp: ItemStorageHost) {}

  readonly groups = computed(() =>
    Array.from(this._groups().entries())
      .map(([, group]) => group)
      .filter(group => group.children().length)
  );
  readonly items = this._items.asReadonly();
  readonly filteredItems = this._filteredItems.asReadonly();
  readonly highlightedItems = this._highlightedItems.asReadonly();

  readonly selectedItems = computed(() => {
    if (this._ardParentComp.sortMultipleValues()) {
      return this._selectedItems().sort((a, b) => {
        return a.index - b.index;
      });
    }
    return this._selectedItems();
  });
  readonly lastSelectedItem = computed(() => this._filteredItems().last(1, item => !item.disabled()));

  readonly value = computed(() => this._itemsToValue(this.selectedItems()));
  private _itemsToValue(items: ArdOption[]): any[] {
    return items.map(item => item.value());
  }

  readonly isNoItemsToSelect = computed(() => this._items().length === this._selectedItems().length);
  readonly isNoItemsFound = computed(() => this._filteredItems().length === 0);
  readonly isAnyItemSelected = computed(() => this._selectedItems().length > 0);
  readonly isAnyItemHighlighted = computed(() => this._highlightedItems().length > 0);
  readonly isItemLimitReached = computed(
    () =>
      this._ardParentComp.multiselectable() &&
      isDefined(this._ardParentComp.maxSelectedItems()) &&
      this._ardParentComp.maxSelectedItems()! <= this.selectedItems().length
  );

  setItems(items: any[]): boolean {
    let areItemsPrimitive = false;
    if (this._ardParentComp.groupLabelFrom() && this._ardParentComp.itemsAlreadyGrouped()) {
      const newItems = [];
      for (const group of items) {
        let children: any[];
        [children, areItemsPrimitive] = this._ungroupAlreadyGroupedItems(group);
        newItems.push(...children);
      }
      items = newItems;
    }
    if (any(items, isPrimitive)) {
      items = items.map(this._primitiveItemsMapFn);
      areItemsPrimitive = true;
    }

    this._items.set(
      items.map((item, index) => {
        return this._setItemsMapFn(item, index, areItemsPrimitive);
      })
    );

    //add all items to filter array
    this._filteredItems.set(this._items());

    //add items to groups
    this._populateGroups();

    //write value if it was
    const toWrite = this._valueToWriteAfterItemsLoad();
    if (toWrite !== undefined) {
      this.handleWriteValue(toWrite);
    }

    return areItemsPrimitive;
  }
  private _addSingleItem(item: any): ArdOption {
    const isItemPrimitive = isPrimitive(item);
    //map a primitive item to a usable object
    if (isItemPrimitive) {
      item = this._primitiveItemsMapFn(item);
    }
    //map the item to create data bindings
    const ardOption = this._setItemsMapFn(item, (this._items().last()?.index ?? 0) + 1, isItemPrimitive);

    //push the item into all items
    this._items.update(v => [...v, ardOption]);

    //add item to groups
    this._populateGroups();

    return ardOption;
  }
  private _primitiveItemsMapFn<T>(item: T): { value: T } {
    return { value: item };
  }
  private _ungroupAlreadyGroupedItems<T extends object>(group: T): [any[], boolean] {
    //determine groupBy (groupLabel) path
    const groupBy = this._ardParentComp.groupLabelFrom() ?? this._ardParentComp.DEFAULTS.groupLabelFrom;

    //get group label from object
    let groupName: any;
    if (typeof groupBy === 'string') {
      groupName = resolvePath(group, groupBy);
    } else {
      groupName = groupBy(group);
    }

    //determine group children path
    const childrenPath = this._ardParentComp.childrenFrom() ?? this._ardParentComp.DEFAULTS.childrenFrom;

    //get group children
    let groupItems: any = resolvePath(group, childrenPath);

    //return empty array if groupItems is not an array or is empty
    if (!isArray(groupItems) || groupItems.length === 0) return [[], false];

    //check if the array is an array of primitives, and map it if needed
    const areItemsPrimitive = false;
    if (any(groupItems, isPrimitive)) {
      groupItems = groupItems.map(this._primitiveItemsMapFn);
    }
    //add group name to every child
    groupItems = groupItems.map((item: any) => {
      item.$ardgroup = groupName;
      return item;
    });

    return [groupItems, areItemsPrimitive];
  }
  private _setItemsMapFn(rawItemData: any, index: number, areItemsPrimitive: boolean): ArdOption {
    if (areItemsPrimitive) {
      return {
        itemData: signal(rawItemData),
        index: index,
        value: signal(rawItemData.value),
        label: signal(rawItemData.value?.toString?.() ?? String(rawItemData.value)),
        disabled: signal(false),
        selected: signal(false),
        highlighted: signal(false),
        group: undefined,
        highlighted_recently: signal(false),
      };
    }
    //get value
    const valuePath =
      this._ardParentComp.valueFrom() ?? this._ardParentComp.labelFrom() ?? this._ardParentComp.DEFAULTS.valueFrom;
    const value = resolvePath(rawItemData, valuePath);

    //get label
    const labelPath =
      this._ardParentComp.labelFrom() ?? this._ardParentComp.valueFrom() ?? this._ardParentComp.DEFAULTS.labelFrom;
    const label = resolvePath(rawItemData, labelPath) ?? value;

    //get disabled
    const disabledPath = this._ardParentComp.disabledFrom() ?? this._ardParentComp.DEFAULTS.disabledFrom;
    let disabled = evaluate(resolvePath(rawItemData, disabledPath));
    if (this._ardParentComp.invertDisabled()) {
      disabled = !disabled;
    }

    //get groups
    let group: any = undefined;
    const groupBy = this._ardParentComp.groupLabelFrom();
    if (groupBy) {
      if (rawItemData.$ardgroup) {
        group = rawItemData.$ardgroup;
      } else {
        if (typeof groupBy === 'string') {
          group = resolvePath(rawItemData, groupBy);
        } else {
          group = groupBy(rawItemData);
        }
      }
    }

    //return
    return {
      itemData: signal(rawItemData),
      index: index,
      value: signal(value),
      label: signal(label?.toString?.() ?? String(label)),
      disabled: signal(disabled),
      group: group,
      selected: signal(false),
      highlighted: signal(false),
      highlighted_recently: signal(false),
    };
  }
  private _populateGroups(): void {
    this._groups.set(this._createEmptyGroupMap());

    for (const item of this._filteredItems()) {
      if (this._ardParentComp.hideSelected() && item.selected()) continue;

      this._addToGroup(item);
    }
  }
  private _addToGroup(item: ArdOption): void {
    const groupKey = item.group;
    const targetGroup = this._groups().get(groupKey);
    //create new group if needed
    if (!targetGroup) {
      this._groups.update(v => {
        const map = new Map(v);
        map.set(groupKey, {
          label: signal(String(groupKey ?? '')),
          children: signal([item]),
          disabled: signal(false),
          selected: signal(false),
          highlighted: signal(false),
        });
        return map;
      });
      return;
    }
    targetGroup.children.update(v => [...v, item]);
  }
  private _createEmptyGroupMap(): ArdItemGroupMap {
    return new Map([
      [
        undefined,
        {
          label: signal(''),
          children: signal([]),
          disabled: signal(false),
          selected: signal(false),
          highlighted: signal(false),
        },
      ],
    ]) as ArdItemGroupMap;
  }
  private _isWriteValueValid(ngModel: any[]): boolean {
    return ngModel.every(item => {
      if (!isDefined(this._ardParentComp.compareWith) && isObject(item) && this._ardParentComp.valueFrom()) {
        console.warn(
          `ARD-WA${this._ardParentComp._componentId}0: Setting object(${JSON.stringify(
            item
          )}) as your model with [valueFrom] is not allowed unless [compareWith] is used.`
        );
        return false;
      }
      return true;
    });
  }
  private readonly _valueToWriteAfterItemsLoad = signal<any>(undefined);
  private readonly _wasValueWriteDeferred = signal<boolean>(false);
  handleWriteValue(ngModel: any[]): void {
    //defer writing the value if no options are yet loaded
    if (!this._wasValueWriteDeferred() && this._items().length === 0) {
      this._valueToWriteAfterItemsLoad.set(ngModel);
      return;
    }

    this.clearAllSelected();

    if (!this._isWriteValueValid(ngModel)) {
      return;
    }

    const selectItemByValue = (value: any) => {
      const item = this.findItemByValue(value);

      if (item) {
        this.selectItem(item);
        return;
      }
      console.warn(
        `ARD-WA${this._ardParentComp._componentId}1: Couldn't find an item with value ${value?.toString?.() || String(value)}.`
      );
    };

    for (const modelValue of ngModel) {
      selectItemByValue(modelValue);
    }
  }
  findItemByValue(valueToFind: any): ArdOption | undefined {
    let findBy: (item: ArdOption) => boolean;
    if (this._ardParentComp.compareWith()) {
      findBy = item => this._ardParentComp.compareWith()!(valueToFind, item.value());
    } else {
      findBy = item => item.value() === valueToFind;
    }
    return this._items().find(item => findBy(item));
  }
  async addCustomOption(value: string, fn: AddCustomFn<any> | AddCustomFn<Promise<any>>): Promise<ArdOption> {
    const fnResult = fn(value);

    let optionValue = fnResult;
    if (isPromise(optionValue)) optionValue = await optionValue;

    const newOptionObj = this._addSingleItem(optionValue);

    return newOptionObj;
  }

  clearAllSelected(repopulateGroups = false): any[] {
    for (const item of this._selectedItems()) {
      item.selected.set(false);
    }
    const removedItemValues = this._itemsToValue(this._selectedItems());
    this._selectedItems.set([]);

    if (repopulateGroups && this._ardParentComp.hideSelected()) this._populateGroups();

    return removedItemValues;
  }
  clearLastSelected(): ArdOption {
    const item = this._selectedItems().last();
    if (!item) return item;
    this.unselectItem(item);
    return item;
  }
  selectItem(...items: ArdOption[]): [any[], any[], any[]] {
    if (this.isItemLimitReached()) {
      return [[], [], this._itemsToValue(items)];
    }
    let unselected = [];
    if (!this._ardParentComp.multiselectable()) {
      unselected = this.clearAllSelected(false);
    }

    let itemsSelectedCount = 0;
    const itemsSelected = [];
    for (const item of items) {
      itemsSelectedCount++;
      if (item.selected()) continue;
      if (this.isItemLimitReached()) {
        break;
      }
      item.selected.set(true);
      this._selectedItems.update(v => [...v, item]);
      itemsSelected.push(item);
    }

    if (this._ardParentComp.hideSelected()) {
      this._populateGroups();
    }

    const itemsFailedToSelect = items.slice(itemsSelectedCount - 1);
    return [this._itemsToValue(itemsSelected), unselected, this._itemsToValue(itemsFailedToSelect)];
  }
  unselectItem(...items: ArdOption[]): any[] {
    for (const item of items) {
      if (!item.selected()) continue;
      item.selected.set(false);
    }
    this._selectedItems.update(v => v.filter(v => v.selected()));

    if (this._ardParentComp.hideSelected()) {
      this._populateGroups();
    }

    return this._itemsToValue(items);
  }

  clearAllHighlights(): void {
    for (const item of this._highlightedItems()) {
      item.highlighted.set(false);
    }
    for (const group of this._highlightedGroups()) {
      group.highlighted.set(false);
    }
    this._highlightedItems.set([]);
    this._highlightedGroups.set([]);
  }
  highlightGroup(group: ArdOptionGroup): ArdOption {
    this.clearAllHighlights();
    group.highlighted.set(true);
    this.highlightItem(...group.children());
    return group.children().first();
  }
  highlightSingleItem(item: ArdOption): ArdOption | null {
    if (!item || item.disabled()) return null;
    this.clearAllHighlights();
    return this.highlightItem(item);
  }
  highlightItem(...items: ArdOption[]): ArdOption {
    for (const item of items) {
      item.highlighted.set(true);
    }
    this._highlightedItems.update(v => [...v, ...items]);
    return items.last();
  }
  unhighlightItem(...items: ArdOption[]): void {
    for (const item of items) {
      if (!item || !item.highlighted) return;

      item.highlighted.set(false);
    }
    this._highlightedItems.update(v => v.filter(v => v.highlighted()));
  }
  highlightFirstItem(): ArdOption | null {
    this.clearAllHighlights();
    const itemsToHighlight = this._getHiglightableItems();
    return this.highlightSingleItem(itemsToHighlight.first());
  }
  highlightLastItem(): ArdOption | null {
    this.clearAllHighlights();
    const itemsToHighlight = this._getHiglightableItems();
    return this.highlightSingleItem(itemsToHighlight.last());
  }
  private _getHiglightableItems(): ArdOption[] {
    let itemsToHighlight = this._filteredItems().filter(item => !item.disabled());
    if (this._ardParentComp.hideSelected()) {
      itemsToHighlight = itemsToHighlight.filter(item => !item.selected());
    }
    return itemsToHighlight;
  }
  highlightAllItems(): void {
    this.highlightItem(...this._getHiglightableItems());
  }
  private _clearRecentlyHighlighted(): void {
    if (this._recentlyHighlightedItem()) {
      this._recentlyHighlightedItem()!.highlighted_recently.set(false);
    }
  }
  setRecentlyHighlighted(item: ArdOption): void {
    this._clearRecentlyHighlighted();
    item.highlighted_recently.set(true);
    this._recentlyHighlightedItem.set(item);
  }
  highlightNextItem(offset: number, hasShift?: boolean): ArdOption | null {
    if (!this.isAnyItemHighlighted()) {
      return this.highlightFirstItem();
    }
    const currentItem = this.highlightedItems().last();
    const highlightableItems = this._getHiglightableItems();
    const currentIndexInFiltered = highlightableItems.findIndex(item => item.index === currentItem.index);

    let nextItemIndex = currentIndexInFiltered + offset;
    if (nextItemIndex >= highlightableItems.length) {
      nextItemIndex -= highlightableItems.length;
    }
    if (nextItemIndex < 0) {
      nextItemIndex += highlightableItems.length;
    }
    const itemToHighlight = highlightableItems[nextItemIndex];

    if (hasShift && this._ardParentComp.multiselectable()) {
      if (itemToHighlight.highlighted()) {
        this.unhighlightItem(currentItem);
      }
      return this.highlightItem(itemToHighlight);
    }
    return this.highlightSingleItem(itemToHighlight);
  }
  filter(filterTerm: string): any[] {
    if (!filterTerm) {
      return this._itemsToValue(this.resetFiltered());
    }
    if (!this._ardParentComp.searchCaseSensitive()) {
      filterTerm = filterTerm.toLocaleLowerCase();
    }

    const searchFn = this._ardParentComp.searchFn();
    const newFilteredItems = this._items().filter(item => searchFn(filterTerm, item));
    this._filteredItems.set(newFilteredItems);

    this._populateGroups();

    if (!this.isNoItemsFound) this.highlightFirstItem();
    else this.clearAllHighlights();

    return this._itemsToValue(newFilteredItems);
  }
  resetFiltered(): ArdOption[] {
    if (this._filteredItems().length === this._items().length) return this._items();

    let newFilteredItems = this._items();
    if (this._ardParentComp.hideSelected() && this.isAnyItemSelected()) {
      newFilteredItems = newFilteredItems.filter(item => !item.selected());
    }
    this._populateGroups();
    return newFilteredItems;
  }
}
