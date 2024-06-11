import { Signal, computed, signal } from '@angular/core';
import resolvePath from 'resolve-object-path';
import { evaluate, isDefined, isObject, isPrimitive } from 'simple-bool';
import { ArdOptionSimple, CompareWithFn } from '../../types/item-storage.types';
import { Nullable } from '../../types/utility.types';

export interface ItemStorageHostDefaults {
  valueFrom: string;
  labelFrom: string;
  disabledFrom: string;
}
export interface SimpleItemStorageHost {
  readonly valueFrom: Signal<Nullable<string>>;
  readonly labelFrom: Signal<Nullable<string>>;
  readonly disabledFrom: Signal<Nullable<string>>;
  readonly invertDisabled: Signal<boolean>;
  readonly DEFAULTS: ItemStorageHostDefaults;
  readonly compareWith: Signal<Nullable<CompareWithFn>>;
  readonly multiselectable: Signal<boolean>;
  readonly isValueRequired: Signal<boolean>;
  readonly maxSelectedItems: Signal<Nullable<number>>;
  readonly _componentId: string;
}

export class SimpleItemStorage {
  private readonly _items = signal<ArdOptionSimple[]>([]);
  private readonly _highlightedItems = signal<ArdOptionSimple[]>([]);
  private readonly _selectedItems = signal<ArdOptionSimple[]>([]);

  constructor(private readonly _ardParentComp: SimpleItemStorageHost) {}

  /**
   * Gets all items.
   */
  readonly items = computed(() => this._items());
  /**
   * Gets all currently highlighted items.
   */
  readonly highlightedItems = computed(() => this._highlightedItems());
  /**
   * Gets all currently selected items.
   */
  readonly selectedItems = computed(() => this._selectedItems());
  /**
   * Gets the values of the currently selected items.
   */
  readonly value = computed(() => this._itemsToValue(this._selectedItems()));
  /**
   * Maps an array of items into their values.
   * @param items The items to convert to value.
   * @returns An array of item values.
   */
  private _itemsToValue(items: ArdOptionSimple[]): any[] {
    return items.map(item => item.value);
  }

  /**
   * Returns true if at least one item is highlighted, otherwise false.
   */
  readonly isAnyItemHighlighted = computed(() => this._highlightedItems().length > 0);
  /**
   * Returns true if the parent component defines the limit of concurrently selectable items and the amount of currently selected items matches that limit. Otherwise returns false.
   *
   * **TLDR**: true if `maxSelectedItems` is defined and the number of selected items matches that value.
   */
  readonly isItemLimitReached = computed(() => {
    const msi = this._ardParentComp.maxSelectedItems();
    if (!this._ardParentComp.multiselectable || !isDefined(msi)) {
      return false;
    }
    return msi <= this.selectedItems().length;
  });

  /**
   * Sets the component's items. Takes into account the values defined by the parent component for `valueFrom`, `labelFrom`, and `disabledFrom`.
   * @param items An array of items to be set as the component's items.
   * @returns true if at least one of the items is of primitive type, otherwise false.
   */
  setItems(items: unknown[]): boolean {
    let areItemsPrimitive = false;
    if (items.some(isPrimitive)) {
      items = items.map(this._primitiveItemsMapFn);
      areItemsPrimitive = true;
    }

    this._items.set(
      items.map((item, index) => {
        return this._setItemsMapFn(item, index, areItemsPrimitive);
      })
    );

    return areItemsPrimitive;
  }
  private _primitiveItemsMapFn<T>(item: T): { value: T } {
    return { value: item };
  }
  private _setItemsMapFn(rawItemData: any, index: number, areItemsPrimitive: boolean): ArdOptionSimple {
    if (areItemsPrimitive) {
      return {
        itemData: signal(rawItemData),
        index: signal(index),
        value: signal(rawItemData.value),
        label: signal(rawItemData.value?.toString?.() ?? String(rawItemData.value)),
        disabled: signal(false),
        selected: signal(false),
        highlighted: signal(false),
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

    //return
    return {
      itemData: signal(rawItemData),
      index: signal(index),
      value: signal(value),
      label: signal(label?.toString?.() ?? String(label)),
      disabled: signal(disabled),
      selected: signal(false),
      highlighted: signal(false),
    };
  }
  /**
   * Writes a new value to the item storage. Selects the correct items based on the provided values, warning the user if the value is not found.
   * @param ngModel The value of the ngModel to set.
   */
  writeValue(ngModel: any[]): void {
    this._forceUnselectAll();

    if (!this._validateWriteValue(ngModel)) return;

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
  /**
   * Validates that all values of the value to be written are able to be accurately compared against the storage items.
   *
   * An item from the ngModel array is considered valid if it is a primitive value, or if all of the below points are met:
   * 1. The parent component defines the `compareWith` property.
   * 2. The ngModel value item is an object (or array).
   * 3. The parent component has a defined `valueFrom` property.
   * @param ngModel The value of ngModel to validate.
   * @returns true if all items are valid, otherwise false.
   */
  private _validateWriteValue(ngModel: any[]): boolean {
    return ngModel.every(item => {
      if (!isDefined(this._ardParentComp.compareWith) && isObject(item) && this._ardParentComp.valueFrom()) {
        console.warn(
          `ARD-FT${this._ardParentComp._componentId}0: Setting object(${JSON.stringify(item)}) as your model with [valueFrom] is not allowed unless [compareWith] is used.`
        );
        return false;
      }
      return true;
    });
  }
  findItemByValue(valueToFind: any): ArdOptionSimple | undefined {
    let findBy: (item: ArdOptionSimple) => boolean;
    if (isDefined(this._ardParentComp.compareWith)) {
      findBy = item => this._ardParentComp.compareWith()!(valueToFind, item.value);
    } else {
      findBy = item => item.value === valueToFind;
    }
    return this._items().find(item => findBy(item));
  }

  /**
   * Unselects all selected items.
   *
   * If the parent component requires at least one value to be selected at all times, the first selected items is left selected.
   * @returns An array of items cleared, mapped to only their values.
   */
  unselectAll(): any[] {
    for (const item of this._selectedItems()) {
      item.selected.set(false);
    }

    const ret = this.value();

    if (this._ardParentComp.isValueRequired() && this._selectedItems().length > 0) {
      this._selectedItems().first().selected.set(true);
      ret.splice(0, 1);
    }

    this._selectedItems.set([]);

    return ret;
  }
  /**
   * Unselects all selected items, no matter what the component settings are.
   * @returns An array of items cleared, mapped to only their values.
   */
  private _forceUnselectAll(): any[] {
    for (const item of this._selectedItems()) {
      item.selected.set(false);
    }

    const ret = this._itemsToValue(this._selectedItems());

    this._selectedItems.set([]);

    return ret;
  }
  /**
   * Selects one or multiple items.
   *
   * Accounts for the limit of concurrently selected items defined by the parent component.
   * @param items A rest operator array of item objects to be selected.
   * @returns A tuple containing three arrays, all mapped to only their values:
   * * An array of items selected,
   * * An array of items unselected,
   * * An array of items failed to select due to the limit.
   */
  selectItem(...items: ArdOptionSimple[]): [any[], any[], any[]] {
    if (this.isItemLimitReached()) {
      return [[], [], this._itemsToValue(items)];
    }
    let unselected = [];
    if (!this._ardParentComp.multiselectable) {
      unselected = this._forceUnselectAll();
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
      this._selectedItems().push(item);
      itemsSelected.push(item);
    }

    const itemsFailedToSelect = items.slice(itemsSelectedCount - 1);
    return [this._itemsToValue(itemsSelected), unselected, this._itemsToValue(itemsFailedToSelect)];
  }
  /**
   *
   * @param items A rest operator array of item objects to be unselected.
   * @returns An array of items unselected, mapped to only their values.
   */
  unselectItem(...items: ArdOptionSimple[]): any[] {
    let skippedItem = false;
    for (const item of items) {
      if (this._ardParentComp.isValueRequired() && !skippedItem) {
        skippedItem = true;
        continue;
      }

      if (!item.selected()) continue;
      item.selected.set(false);
    }
    setTimeout(() => {
      this._selectedItems.update(v => v.filter(v => v.selected()));
    }, 0);

    return this._itemsToValue(items);
  }

  /**
   * Unhighlights all currently highlighted items.
   */
  unhighlightAll(): void {
    for (const item of this._highlightedItems()) {
      item.highlighted.set(false);
    }
    this._highlightedItems.set([]);
  }
  /**
   * Highlights the given item, while unhighlighting all other items. Does nothing when the item is disabled.
   * @param item The item to be highlighted.
   * @returns The highlighted item.
   */
  highlightSingleItem(item: ArdOptionSimple): ArdOptionSimple | null {
    if (!item || item.disabled()) return null;
    this.unhighlightAll();
    return this.highlightItem(item);
  }
  /**
   * Highlights all given items.
   * @param items A rest operator array of items to be highlighted.
   * @returns The last highlighted item.
   */
  highlightItem(...items: ArdOptionSimple[]): ArdOptionSimple {
    for (const item of items) {
      item.highlighted.set(true);
    }
    this._highlightedItems().push(...items);
    return items.last();
  }
  /**
   * Unhighlights all given items.
   * @param items A rest operator array of items to be unhighlighted.
   */
  unhighlightItem(...items: ArdOptionSimple[]): void {
    for (const item of items) {
      if (!item || !item.highlighted()) return;

      item.highlighted.set(false);
    }
    setTimeout(() => {
      this._highlightedItems.update(v => v.filter(v => v.highlighted()));
    }, 0);
  }
  /**
   * Highlights the first item out of all items.
   * @returns The highlighted item.
   */
  highlightFirstItem(): ArdOptionSimple | null {
    this.unhighlightAll();

    const itemToHighlight = this.highlightableItems().first();
    return this.highlightItem(itemToHighlight);
  }
  /**
   * Highlights the last item out of all items.
   * @returns The highlighted item.
   */
  highlightLastItem(): ArdOptionSimple | null {
    this.unhighlightAll();

    const itemToHighlight = this.highlightableItems().last();
    return this.highlightItem(itemToHighlight);
  }
  /**
   * Highlights all non-disabled items.
   */
  highlightAllItems(): void {
    const itemsToHighlight = this.highlightableItems();

    this.highlightItem(...itemsToHighlight);
  }
  /**
   * Highlights the next non-disabled item defined by the offset amount.
   *
   * If `hasShift` is set to true, all originally highlighted items are kept. Otherwise, all original items are unselected.
   * @param offset The amount of items to offset the highlight by.
   * @param hasShift Whether the user has the shift key pressed.
   * @returns The item highlighted.
   */
  highlightNextItem(offset: number, hasShift?: boolean): ArdOptionSimple | null {
    if (!this.isAnyItemHighlighted()) {
      return this.highlightFirstItem();
    }
    const currentItem = this.highlightedItems().last();
    const itemsWithoutDisabled = this._items().filter(
      item => !item.disabled() && (!this.isItemLimitReached() || item.selected())
    );
    const currentIndexInItems = itemsWithoutDisabled.findIndex(item => item.index() === currentItem.index());

    let nextItemIndex = currentIndexInItems + offset;
    if (nextItemIndex >= itemsWithoutDisabled.length) {
      nextItemIndex -= itemsWithoutDisabled.length;
    }
    if (nextItemIndex < 0) {
      nextItemIndex += itemsWithoutDisabled.length;
    }
    const itemToHighlight = itemsWithoutDisabled[nextItemIndex];

    if (hasShift && this._ardParentComp.multiselectable()) {
      if (itemToHighlight.highlighted()) {
        this.unhighlightItem(currentItem);
      }
      return this.highlightItem(itemToHighlight);
    }
    return this.highlightSingleItem(itemToHighlight);
  }
  /**
   * Finds all highlightable items. An item is considered highlightable if it is **not** disabled.
   * @returns An array of all highlightable items.
   */
  private readonly highlightableItems = computed(() => this._items().filter(item => !item.disabled()));
}
