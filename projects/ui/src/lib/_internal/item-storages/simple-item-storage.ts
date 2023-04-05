import { ArdOptionSimple, CompareWithFn } from "./item-storage.types";
import resolvePath from 'resolve-object-path';
import { any, evaluate, isDefined, isObject, isPrimitive } from "simple-bool";

export interface ItemStorageHostDefaults {
    valueFrom: string;
    labelFrom: string;
    disabledFrom: string;
    [key: string]: any;
}
export interface SimpleItemStorageHost {
    valueFrom?: string;
    labelFrom?: string;
    disabledFrom?: string;
    invertDisabled?: boolean;
    readonly DEFAULTS: ItemStorageHostDefaults;
    compareWith?: CompareWithFn;
    multiselectable: boolean;
    requireValue: boolean;
    maxSelectedItems?: number;
}

export class SimpleItemStorage {
    private _items: ArdOptionSimple[] = [];
    private _highlightedItems: ArdOptionSimple[] = [];
    private _selectedItems: ArdOptionSimple[] = [];

    constructor(
        private _ardParentComp: SimpleItemStorageHost,
    ) {}

    get items(): ArdOptionSimple[] {
        return this._items;
    }
    get selectedItems(): ArdOptionSimple[] {
        return this._selectedItems;
    }
    get highlightedItems(): ArdOptionSimple[] {
        return this._highlightedItems;
    }
    get value(): any[] {
        return this._itemsToValue(this.selectedItems);
    }
    private _itemsToValue(items: ArdOptionSimple[]): any[] {
        return items.map(item => item.value);
    }

    get isAnyItemHighlighted(): boolean {
        return this._highlightedItems.length > 0;
    }
    get isItemLimitReached(): boolean {
        if (!this._ardParentComp.multiselectable || !isDefined(this._ardParentComp.maxSelectedItems)) {
            return false;
        }
        return this._ardParentComp.maxSelectedItems <= this.selectedItems.length;
    }

    setItems(items: any[]) {
        let areItemsPrimitive = false;
        if (any(items, isPrimitive)) {
            items = items.map(this._primitiveItemsMapFn);
            areItemsPrimitive = true;
        }

        this._items = items.map((item, index) => {
            return this._setItemsMapFn(item, index, areItemsPrimitive);
        });

        return areItemsPrimitive;
    }
    private _primitiveItemsMapFn<T>(item: T): { value: T } {
        return { value: item };
    }
    private _setItemsMapFn(itemData: any, index: number, areItemsPrimitive: boolean): ArdOptionSimple {
        if (areItemsPrimitive) {
            return {
                itemData,
                index,
                value: itemData.value,
                label: itemData.value?.toString?.() ?? String(itemData.value),
            }
        }
        //get value
        const valuePath = this._ardParentComp.valueFrom ?? this._ardParentComp.labelFrom ?? this._ardParentComp.DEFAULTS.valueFrom;
        const value = resolvePath(itemData, valuePath);

        //get label
        const labelPath = this._ardParentComp.labelFrom ?? this._ardParentComp.valueFrom ?? this._ardParentComp.DEFAULTS.labelFrom;
        const label = resolvePath(itemData, labelPath) ?? value;

        //get disabled
        const disabledPath = this._ardParentComp.disabledFrom ?? this._ardParentComp.DEFAULTS.disabledFrom;
        let disabled = evaluate(resolvePath(itemData, disabledPath));
        if (this._ardParentComp.invertDisabled) {
            disabled = !disabled;
        }

        //return
        return {
            itemData,
            index,
            value,
            label: label?.toString?.() ?? String(label),
            disabled,
        }
    }
    private _isWriteValueValid(ngModel: any[]): boolean {
        return ngModel.every(item => {
            if (!isDefined(this._ardParentComp.compareWith) && isObject(item) && this._ardParentComp.valueFrom) {
                console.warn(
                    `Setting object(${JSON.stringify(item)}) as your model with [valueFrom] is not allowed unless [compareWith] is used.`
                );
                return false;
            }
            return true;
        });
    }
    handleWriteValue(ngModel: any[]): void {
        this.clearAllSelected();

        if (!this._isWriteValueValid(ngModel)) {
            return;
        }

        const selectItemByValue = (value: any) => {
            let item = this.findItemByValue(value);

            if (item) {
                this.selectItem(item);
                return;
            }
            console.warn(`Couldn't find an item with value ${value?.toString?.() || String(value)}.`);
        }

        for (const modelValue of ngModel) {
            selectItemByValue(modelValue);
        }
    }
    findItemByValue(valueToFind: any): ArdOptionSimple | undefined {
        let findBy: (item: ArdOptionSimple) => boolean;
        if (this._ardParentComp.compareWith) {
            findBy = item => this._ardParentComp.compareWith!(valueToFind, item.value);
        }
        else {
            findBy = item => item.value === valueToFind;
        }
        return this._items.find(item => findBy(item));
    }

    clearAllSelected(): any[] {
        for (const item of this._selectedItems) {
            item.selected = false;
        }
        
        const ret = this._selectedItems.map(item => item.value);

        if (this._ardParentComp.requireValue && this._selectedItems.length > 0) {
            this._selectedItems.first().selected = true;
            ret.splice(0, 1);
        }

        this._selectedItems = [];

        return ret;
    }
    private _forceClearAllSelected(): any[] {
        for (const item of this._selectedItems) {
            item.selected = false;
        }

        const ret = this._selectedItems.map(item => item.value);

        this._selectedItems = [];

        return ret;
    }
    selectItem(...items: ArdOptionSimple[]): [any[], any[], any[]] {
        if (this.isItemLimitReached) {
            return [[], [], items.map(item => item.value)];
        }
        let unselected = [];
        if (!this._ardParentComp.multiselectable) {
            unselected = this._forceClearAllSelected();
        }

        let itemsSelectedCount = 0;
        const itemsSelected = [];
        for (const item of items) {
            itemsSelectedCount++;
            if (item.selected) continue;
            if (this.isItemLimitReached) {
                break;
            }
            item.selected = true;
            this._selectedItems.push(item);
            itemsSelected.push(item);
        }

        const itemsFailedToSelect = items.slice(itemsSelectedCount - 1);
        return [itemsSelected.map(item => item.value), unselected, itemsFailedToSelect.map(item => item.value)];
    }
    unselectItem(...items: ArdOptionSimple[]): any[] {
        let selectedItemsCount = this.selectedItems.length;
        for (const item of items) {
            if (selectedItemsCount <= 1) break;
            selectedItemsCount--;

            if (!item.selected) continue;
            item.selected = false;
        }
        this._selectedItems = this._selectedItems.filter(v => v.selected);

        return items.map(item => item.value);
    }

    clearAllHighlights(): void {
        for (const item of this._highlightedItems) {
            item.highlighted = false;
        }
        this._highlightedItems = [];
    }
    highlightSingleItem(item: ArdOptionSimple): ArdOptionSimple | null {
        if (!item || item.disabled) return null;
        this.clearAllHighlights();
        return this.highlightItem(item);
    }
    highlightItem(...items: ArdOptionSimple[]): ArdOptionSimple {
        for (const item of items) {
            item.highlighted = true;
        }
        this._highlightedItems.push(...items);
        return items.last();
    }
    unhighlightItem(...items: ArdOptionSimple[]): void {
        for (const item of items) {
            if (!item || !item.highlighted) return;

            item.highlighted = false;
        }
        this._highlightedItems = this._highlightedItems.filter(v => v.highlighted);
    }
    highlightFirstItem(): ArdOptionSimple | null {
        this.clearAllHighlights();

        let itemToHighlight = this._getHiglightableItems().first();
        return this.highlightItem(itemToHighlight);
    }
    highlightLastItem(): ArdOptionSimple | null {
        this.clearAllHighlights();

        let itemToHighlight = this._getHiglightableItems().last();
        return this.highlightItem(itemToHighlight);
    }
    private _getHiglightableItems(): ArdOptionSimple[] {
        return this._items.filter(item => !item.disabled);
    }
    highlightAllItems(): void {
        let itemsToHighlight = this._items.filter(item => !item.disabled);

        this.highlightItem(...itemsToHighlight);
    }
    highlightNextItem(offset: number, hasShift?: boolean): ArdOptionSimple | null {
        if (!this.isAnyItemHighlighted) {
            return this.highlightFirstItem();
        }
        const currentItem = this.highlightedItems.last();
        const itemsWithoutDisabled = this._items.filter(item => !item.disabled);
        const currentIndexInItems = itemsWithoutDisabled.findIndex(item => item.index == currentItem.index);

        let nextItemIndex = currentIndexInItems + offset;
        if (nextItemIndex >= itemsWithoutDisabled.length) {
            nextItemIndex -= itemsWithoutDisabled.length;
        }
        if (nextItemIndex < 0) {
            nextItemIndex += itemsWithoutDisabled.length;
        }
        const itemToHighlight = itemsWithoutDisabled[nextItemIndex];

        if (hasShift && this._ardParentComp.multiselectable) {
            if (itemToHighlight.highlighted) {
                this.unhighlightItem(currentItem);
            }
            return this.highlightItem(itemToHighlight);
        }
        return this.highlightSingleItem(itemToHighlight);
    }
}