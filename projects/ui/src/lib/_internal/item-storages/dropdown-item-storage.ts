import { ArdOptionGroup, ArdOption, GroupByFn, ArdItemGroupMap, SearchFn, CompareWithFn } from "../../types/item-storage.types"; 
import resolvePath from 'resolve-object-path';
import { any, evaluate, isArray, isDefined, isObject, isPrimitive, isPromise } from "simple-bool";
import { AddCustomFn } from "../../select/select.types";

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
    valueFrom?: string;
    labelFrom?: string;
    disabledFrom?: string;
    invertDisabled?: boolean;
    groupLabelFrom?: string | GroupByFn;
    groupDisabledFrom?: string;
    childrenFrom?: string;
    readonly DEFAULTS: ItemStorageHostDefaults;
    groupItems?: boolean;
    itemsAlreadyGrouped?: boolean;
    hideSelected: boolean;
    searchCaseSensitive: boolean;
    searchFn: SearchFn;
    compareWith?: CompareWithFn;
    multiselectable: boolean;
    sortMultipleValues: boolean;
    maxSelectedItems?: number;
    addCustom: boolean | AddCustomFn<any> | AddCustomFn<Promise<any>>;
}

export class ItemStorage {
    private _groups: ArdItemGroupMap = this._createEmptyGroupMap();
    private _items: ArdOption[] = [];
    private _filteredItems: ArdOption[] = [];
    private _highlightedItems: ArdOption[] = [];
    private _highlightedGroups: ArdOptionGroup[] = [];
    private _recentlyHighlightedItem?: ArdOption;
    private _selectedItems: ArdOption[] = [];

    constructor(
        private _ardParentComp: ItemStorageHost,
    ) {}

    get groups(): ArdOptionGroup[] {
        return Array.from(this._groups.entries())
            .map(([_, group]) => group)
            .filter(group => group.children.length);
    }
    get items(): ArdOption[] {
        return this._items;
    }
    get filteredItems(): ArdOption[] {
        return this._filteredItems;
    }
    get selectedItems(): ArdOption[] {
        if (this._ardParentComp.sortMultipleValues) {
            return this._selectedItems.sort((a, b) => {
                return a.index - b.index;
            })
        }
        return this._selectedItems;
    }
    get highlightedItems(): ArdOption[] {
        return this._highlightedItems;
    }
    get lastSelectedItem(): ArdOption {
        return this._filteredItems.last(1, item => !item.disabled);
    }
    get value(): any[] {
        return this._itemsToValue(this.selectedItems);
    }
    private _itemsToValue(items: ArdOption[]): any[] {
        return items.map(item => item.value);
    }

    get isNoItemsToSelect(): boolean {
        return this._items.length == this._selectedItems.length;
    }
    get isNoItemsFound(): boolean {
        return this._filteredItems.length == 0;
    }
    get isAnyItemSelected(): boolean {
        return this._selectedItems.length > 0;
    }
    get isAnyItemHighlighted(): boolean {
        return this._highlightedItems.length > 0;
    }
    get isItemLimitReached(): boolean {
        return (
            this._ardParentComp.multiselectable
            && isDefined(this._ardParentComp.maxSelectedItems)
            && this._ardParentComp.maxSelectedItems! <= this.selectedItems.length
        );
    }

    setItems(items: any[]): boolean {
        let areItemsPrimitive = false;
        if (this._ardParentComp.groupItems && this._ardParentComp.itemsAlreadyGrouped) {
            let newItems = [];
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

        this._items = items.map((item, index) => {
            return this._setItemsMapFn(item, index, areItemsPrimitive);
        });

        //add all items to filter array
        this._filteredItems = this._items;

        //add items to groups
        this._populateGroups();

        //write value if it was
        if (this._valueToWriteAfterItemsLoad !== undefined) {
            this.handleWriteValue(this._valueToWriteAfterItemsLoad);
        }

        return areItemsPrimitive;
    }
    private _addSingleItem(item: any): ArdOption {
        let isItemPrimitive = isPrimitive(item);
        //map a primitive item to a usable object
        if (isItemPrimitive) {
            item = this._primitiveItemsMapFn(item);
        }
        //map the item to create data bindings
        const ardOption = this._setItemsMapFn(item, this._items.last()?.index + 1, isItemPrimitive);

        //push the item into all items
        this._items.push(ardOption);

        //add item to groups
        this._populateGroups();

        return ardOption;
    }
    private _primitiveItemsMapFn<T>(item: T): { value: T } {
        return { value: item };
    }
    private _ungroupAlreadyGroupedItems<T extends object>(group: T): [any[], boolean] {
        //determine groupBy (groupLabel) path
        let groupBy = this._ardParentComp.groupLabelFrom ?? this._ardParentComp.DEFAULTS.groupLabelFrom;

        //get group label from object
        let groupName: any;
        if (typeof groupBy == 'string') {
            groupName = resolvePath(group, groupBy);
        }
        else {
            groupName = groupBy(group);
        }

        //determine group children path
        let childrenPath = this._ardParentComp.childrenFrom ?? this._ardParentComp.DEFAULTS.childrenFrom;

        //get group children
        let groupItems: any = resolvePath(group, childrenPath);

        //return empty array if groupItems is not an array or is empty
        if (!isArray(groupItems) || groupItems.length == 0) return [[], false];

        //check if the array is an array of primitives, and map it if needed
        let areItemsPrimitive = false;
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

        //get disabled
        const disabledPath = this._ardParentComp.disabledFrom ?? this._ardParentComp.DEFAULTS.disabledFrom;
        let disabled = evaluate(resolvePath(rawItemData, disabledPath));
        if (this._ardParentComp.invertDisabled) {
            disabled = !disabled;
        }

        //get groups
        let group: any = undefined;
        if (this._ardParentComp.groupItems) {
            if (rawItemData.$ardgroup) {
                group = rawItemData.$ardgroup;
            }
            else {
                let groupBy = this._ardParentComp.groupLabelFrom ?? this._ardParentComp.DEFAULTS.groupLabelFrom;
                if (typeof groupBy == 'string') {
                    group = resolvePath(rawItemData, groupBy);
                }
                else {
                    group = (groupBy as GroupByFn)(rawItemData);
                }
            }
        }

        const itemData = areItemsPrimitive ? rawItemData.value : rawItemData;

        //return
        return {
            itemData,
            index,
            value,
            label: label?.toString?.() ?? String(label),
            disabled,
            group,
        }
    }
    private _populateGroups(): void {
        this._groups = this._createEmptyGroupMap();

        for (const item of this._filteredItems) {
            if (
                this._ardParentComp.hideSelected &&
                item.selected
            ) continue;

            this._addToGroup(item);
        }
    }
    private _addToGroup(item: ArdOption): void {
        const groupKey = item.group;
        let targetGroup = this._groups.get(groupKey);
        //create new group if needed
        if (!targetGroup) {
            this._groups.set(groupKey, { label: String(groupKey ?? ''), children: [item] });
            return;
        }
        targetGroup.children.push(item);
    }
    private _createEmptyGroupMap() {
        return new Map([[undefined, { label: '', children: [] }]]);
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
    private _valueToWriteAfterItemsLoad: any;
    private _wasValueWriteDeferred: boolean = false;
    handleWriteValue(ngModel: any[]): void {
        //defer writing the value if no options are yet loaded
        if (!this._wasValueWriteDeferred && this._items.length == 0) {
            this._valueToWriteAfterItemsLoad = ngModel;
            return;
        }

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
    findItemByValue(valueToFind: any): ArdOption | undefined {
        let findBy: (item: ArdOption) => boolean;
        if (this._ardParentComp.compareWith) {
            findBy = item => this._ardParentComp.compareWith!(valueToFind, item.value);
        }
        else {
            findBy = item => item.value === valueToFind;
        }
        return this._items.find(item => findBy(item));
    }
    async addCustomOption(value: string, fn: AddCustomFn<any> | AddCustomFn<Promise<any>>): Promise<ArdOption> {
        const fnResult = fn(value);

        let optionValue = fnResult;
        if (isPromise(optionValue)) optionValue = await optionValue;

        const newOptionObj = this._addSingleItem(optionValue);

        return newOptionObj;
    }



    clearAllSelected(repopulateGroups: boolean = false): any[] {
        for (const item of this._selectedItems) {
            item.selected = false;
        }
        let removedItemValues = this._itemsToValue(this._selectedItems);
        this._selectedItems = [];

        if (repopulateGroups && this._ardParentComp.hideSelected) this._populateGroups();

        return removedItemValues;
    }
    clearLastSelected(): ArdOption {
        let item = this._selectedItems.last();
        if (!item) return item;
        this.unselectItem(item);
        return item;
    }
    selectItem(...items: ArdOption[]): [any[], any[], any[]] {
        if (this.isItemLimitReached) {
            return [[], [], this._itemsToValue(items)];
        }
        let unselected = [];
        if (!this._ardParentComp.multiselectable) {
            unselected = this.clearAllSelected(false);
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

        if (this._ardParentComp.hideSelected) {
            this._populateGroups();
        }

        const itemsFailedToSelect = items.slice(itemsSelectedCount - 1);
        return [this._itemsToValue(itemsSelected), unselected, this._itemsToValue(itemsFailedToSelect)];
    }
    unselectItem(...items: ArdOption[]): any[] {
        for (const item of items) {
            if (!item.selected) continue;
            item.selected = false;
        }
        this._selectedItems = this._selectedItems.filter(v => v.selected);

        if (this._ardParentComp.hideSelected) this._populateGroups();

        return this._itemsToValue(items);
    }

    clearAllHighlights(): void {
        for (const item of this._highlightedItems) {
            item.highlighted = false;
        }
        for (const group of this._highlightedGroups) {
            group.highlighted = false;
        }
        this._highlightedItems = [];
        this._highlightedGroups = [];
    }
    highlightGroup(group: ArdOptionGroup): ArdOption {
        this.clearAllHighlights();
        group.highlighted = true;
        this.highlightItem(...group.children);
        return group.children.first();
    }
    highlightSingleItem(item: ArdOption): ArdOption | null {
        if (!item || item.disabled) return null;
        this.clearAllHighlights();
        return this.highlightItem(item);
    }
    highlightItem(...items: ArdOption[]): ArdOption {
        for (const item of items) {
            item.highlighted = true;
        }
        this._highlightedItems.push(...items);
        return items.last();
    }
    unhighlightItem(...items: ArdOption[]): void {
        for (const item of items) {
            if (!item || !item.highlighted) return;

            item.highlighted = false;
        }
        this._highlightedItems = this._highlightedItems.filter(v => v.highlighted);
    }
    highlightFirstItem(): ArdOption | null {
        this.clearAllHighlights();
        let itemsToHighlight = this._getHiglightableItems();
        return this.highlightSingleItem(itemsToHighlight.first());
    }
    highlightLastItem(): ArdOption | null {
        this.clearAllHighlights();
        let itemsToHighlight = this._getHiglightableItems();
        return this.highlightSingleItem(itemsToHighlight.last());
    }
    private _getHiglightableItems(): ArdOption[] {
        let itemsToHighlight = this._filteredItems.filter(item => !item.disabled);
        if (this._ardParentComp.hideSelected) {
            itemsToHighlight = itemsToHighlight.filter(item => !item.selected);
        }
        return itemsToHighlight;
    }
    highlightAllItems(): void {
        let itemsToHighlight = this._filteredItems.filter(item => !item.disabled);

        if (this._ardParentComp.hideSelected) {
            itemsToHighlight = itemsToHighlight.filter(item => !item.selected);
        }
        this.highlightItem(...itemsToHighlight);
    }
    private _clearRecentlyHighlighted(): void {
        if (this._recentlyHighlightedItem) {
            this._recentlyHighlightedItem.highlighted_recently = false;
        }
    }
    setRecentlyHighlighted(item: ArdOption): void {
        this._clearRecentlyHighlighted();
        this._recentlyHighlightedItem = item;
        this._recentlyHighlightedItem.highlighted_recently = true;
    }
    highlightNextItem(offset: number, hasShift?: boolean): ArdOption | null {
        if (!this.isAnyItemHighlighted) {
            return this.highlightFirstItem();
        }
        const currentItem = this.highlightedItems.last();
        const highlightableItems = this._getHiglightableItems();
        const currentIndexInFiltered = highlightableItems.findIndex(item => item.index == currentItem.index);

        let nextItemIndex = currentIndexInFiltered + offset;
        if (nextItemIndex >= highlightableItems.length) {
            nextItemIndex -= highlightableItems.length;
        }
        if (nextItemIndex < 0) {
            nextItemIndex += highlightableItems.length;
        }
        const itemToHighlight = highlightableItems[nextItemIndex];

        if (hasShift && this._ardParentComp.multiselectable) {
            if (itemToHighlight.highlighted) {
                this.unhighlightItem(currentItem);
            }
            return this.highlightItem(itemToHighlight);
        }
        return this.highlightSingleItem(itemToHighlight);
    }
    filter(filterTerm: string): any[] {
        if (!filterTerm) {
            this.resetFiltered();
            return this._itemsToValue(this._filteredItems);
        }
        if (!this._ardParentComp.searchCaseSensitive) {
            filterTerm = filterTerm.toLocaleLowerCase();
        }

        const searchFn = this._ardParentComp.searchFn;
        this._filteredItems = this._items.filter(item => searchFn(filterTerm, item));

        this._populateGroups();

        if (!this.isNoItemsFound) this.highlightFirstItem();
        else this.clearAllHighlights();

        return this._itemsToValue(this._filteredItems);
    }
    resetFiltered(): void {
        if (this._filteredItems.length == this._items.length) return;

        if (this._ardParentComp.hideSelected && this.isAnyItemSelected) {
            this._filteredItems = this._items.filter(item => !item.selected);
        }
        else {
            this._filteredItems = this._items;
        }
        this._populateGroups();
    }
}