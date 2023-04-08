import resolvePath from "resolve-object-path";
import { any, isPrimitive } from "simple-bool";
import { ArdSuggestionItem } from "../../types/item-storage.types";

export interface SuggestionStorageHostDefaults {
    suggValueFrom: string;
    suggLabelFrom: string;
}
export interface SuggestionStorageHost {
    suggValueFrom?: string;
    suggLabelFrom?: string;
    readonly DEFAULTS: SuggestionStorageHostDefaults;
}

export class SuggestionStorage {
    private _items: ArdSuggestionItem[] = [];
    private _highlightedItem: ArdSuggestionItem | null = null;

    get highlightedItem(): ArdSuggestionItem | null { return this._highlightedItem };

    constructor(
        private _ardParentComp: SuggestionStorageHost,
    ) {  }

    /**
     * Gets all items.
     */
    get items(): ArdSuggestionItem[] {
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
    private _setItemsMapFn(itemData: any, index: number, areItemsPrimitive: boolean): ArdSuggestionItem {
        if (areItemsPrimitive) {
            return {
                itemData,
                index,
                value: itemData.value,
                label: itemData.value?.toString?.() ?? String(itemData.value),
            }
        }
        //get value
        const valuePath = this._ardParentComp.suggValueFrom ?? this._ardParentComp.suggLabelFrom ?? this._ardParentComp.DEFAULTS.suggValueFrom;
        const value = resolvePath(itemData, valuePath);

        //get label
        const labelPath = this._ardParentComp.suggLabelFrom ?? this._ardParentComp.suggValueFrom ?? this._ardParentComp.DEFAULTS.suggLabelFrom;
        const label = resolvePath(itemData, labelPath) ?? value;

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
    selectItem(item: ArdSuggestionItem): any {
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
    highlightItem(item: ArdSuggestionItem): void {
        this.unhighlightCurrent();

        item.highlighted = true; 

        this._highlightedItem = item;
    }
    /**
     * Unhighlights a given item.
     * @param item The item to be unhighlighted.
     */
    unhighlightItem(item: ArdSuggestionItem): void {
        item.highlighted = false; 

        if (this._highlightedItem?.index == item.index) this._highlightedItem = null;
    }
    /**
     * Highlights the first item out of all items.
     * @returns The highlighted item.
     */
    highlightFirstItem(): ArdSuggestionItem | null {
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
    highlightLastItem(): ArdSuggestionItem | null {
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
    highlightNextItem(offset: number): ArdSuggestionItem | null {
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