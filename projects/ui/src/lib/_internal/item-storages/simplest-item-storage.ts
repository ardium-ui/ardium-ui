import resolvePath from "resolve-object-path";
import { any, isPrimitive } from "simple-bool";
import { ArdSimplestStorageItem } from "../../types/item-storage.types";

export interface SimplestItemStorageHostDefaults {
    valueFrom: string;
    labelFrom: string;
}
export interface SimplestItemStorageHost {
    valueFrom?: string;
    labelFrom?: string;
    readonly DEFAULTS: SimplestItemStorageHostDefaults;
}

export class SimplestItemStorage {
    private _items: ArdSimplestStorageItem[] = [];
    private _highlightedItem: ArdSimplestStorageItem | null = null;

    get highlightedItem(): ArdSimplestStorageItem | null { return this._highlightedItem };

    constructor(
        private _ardParentComp: SimplestItemStorageHost,
    ) {  }

    /**
     * Gets all items.
     */
    get items(): ArdSimplestStorageItem[] {
        return this._items;
    }

    /**
     * Returns true if at least one item is highlighted, otherwise false.
     */
    get isAnyItemHighlighted(): boolean {
        return this._highlightedItem != null;
    }

    /**
     * Sets the component's items. Takes into account the values defined by the parent component for `suggValueFrom` and `suggLabelFrom`.
     * @param items An array of items to be set as the component's items.
     * @returns true if at least one of the items is of primitive type, otherwise false.
     */
    setItems(items: any[]): boolean {
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
    private _setItemsMapFn(rawItemData: any, index: number, areItemsPrimitive: boolean): ArdSimplestStorageItem {
        if (areItemsPrimitive) {
            return {
                itemData: rawItemData,
                index,
                value: rawItemData.value,
                label: rawItemData.value?.toString?.() ?? String(rawItemData.value),
            }
        }
        //get value
        const valuePath = this._ardParentComp.valueFrom ?? this._ardParentComp.labelFrom ?? this._ardParentComp.DEFAULTS.valueFrom;
        const value = resolvePath(rawItemData, valuePath);

        //get label
        const labelPath = this._ardParentComp.labelFrom ?? this._ardParentComp.valueFrom ?? this._ardParentComp.DEFAULTS.labelFrom;
        const label = resolvePath(rawItemData, labelPath) ?? value;

        const itemData = areItemsPrimitive ? rawItemData.value : rawItemData;

        //return
        return {
            itemData,
            index,
            value,
            label: label?.toString?.() ?? String(label),
        }
    }

    /**
     * Selects the given item.
     * @param items The item to select.
     * @returns The value of the selected item.
     */
    selectItem(item: ArdSimplestStorageItem): any {
        return item.value;
    }
    selectCurrent(): any {
        if (!this._highlightedItem) return undefined;
        return this.selectItem(this._highlightedItem);
    }

    /**
     * Unhighlights all currently highlighted items.
     */
    unhighlightCurrent(): void {
        if (this._highlightedItem) {
            this._highlightedItem.highlighted = false;
        }
        this._highlightedItem = null;
    }
    /**
     * Highlights a given item.
     * @param item The item to be highlighted.
     */
    highlightItem(item: ArdSimplestStorageItem): void {
        this.unhighlightCurrent();

        item.highlighted = true; 

        this._highlightedItem = item;
    }
    /**
     * Unhighlights a given item.
     * @param item The item to be unhighlighted.
     */
    unhighlightItem(item: ArdSimplestStorageItem): void {
        item.highlighted = false; 

        if (this._highlightedItem?.index == item.index) this._highlightedItem = null;
    }
    /**
     * Highlights the first item out of all items.
     * @returns The highlighted item.
     */
    highlightFirstItem(): ArdSimplestStorageItem | null {
        if (!this.items.length) return null;

        this.unhighlightCurrent();

        let itemToHighlight = this.items.first();
        this.highlightItem(itemToHighlight);

        return itemToHighlight;
    }
    /**
     * Highlights the last item out of all items.
     * @returns The highlighted item.
     */
    highlightLastItem(): ArdSimplestStorageItem | null {
        if (!this.items.length) return null;

        this.unhighlightCurrent();

        let itemToHighlight = this.items.last();
        this.highlightItem(itemToHighlight);

        return itemToHighlight;
    }
    /**
     * Highlights the next non-disabled item defined by the offset amount. 
     * @param offset The amount of items to offset the highlight by.
     * @returns The item highlighted.
     */
    highlightNextItem(offset: number): ArdSimplestStorageItem | null {
        const currentItem = this._highlightedItem;
        if (!currentItem) {
            return this.highlightFirstItem();
        }
        const itemsWithoutDisabled = this._items.filter(item => !item.disabled);
        const currentIndexInItems = itemsWithoutDisabled.findIndex(item => item.index == currentItem.index);

        let nextItemIndex = currentIndexInItems + offset;
        if (nextItemIndex >= itemsWithoutDisabled.length) {
            nextItemIndex -= itemsWithoutDisabled.length;
        }
        else if (nextItemIndex < 0) {
            nextItemIndex += itemsWithoutDisabled.length;
        }
        const itemToHighlight = itemsWithoutDisabled[nextItemIndex];

        this.highlightItem(itemToHighlight);

        return itemToHighlight;
    }
}