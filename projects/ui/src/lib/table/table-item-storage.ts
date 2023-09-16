import resolvePath from 'resolve-object-path';
import { evaluate, isDefined } from "simple-bool";
import { CompareWithFn } from '../types/item-storage.types';
import { TableDataColumn, TableSubheader } from './table.types';
import { areAllDataColumns, isTableSubheader, merge2dArrays } from './utils';

export interface ArdTableRow {
    readonly itemData: any;
    readonly index: number;
    data: any[];
    dataColumns: TableDataColumn[];
    class?: string;
    disabled?: boolean;
    bold?: boolean;
    selected?: boolean;
    highlighted?: boolean;
}
export interface TableItemStorageHostDefaults {
    rowDisabledFrom: string;
    rowBoldFrom: string;
}
export interface TableItemStorageHost {
    rowDisabledFrom?: string;
    rowBoldFrom?: string;
    invertDisabled?: boolean;
    data?: any[];
    readonly DEFAULTS: TableItemStorageHostDefaults;
    compareWith?: CompareWithFn;
    maxSelectedItems?: number;
    treatDataSourceAsString?: boolean;
}
export interface DataColumn extends TableDataColumn {

}
export class HeaderCell {
    colspan!: number;
    rowspan!: number;
    cell!: TableDataColumn | TableSubheader;

    get width(): string | null {
        if (isTableSubheader(this.cell)) return null;
        return this._getWidth(this.cell.width);
    }
    get minWidth(): string | null {
        if (isTableSubheader(this.cell)) return null;
        return this._getWidth(this.cell.minWidth);
    }
    private _getWidth(width: string | number | undefined): string | null {
        if (!width) return null;
        if (typeof width == 'number') return `${width}px`;
        return width;
    }

    constructor(cell: TableDataColumn | TableSubheader, colspan: number = 1, rowspan: number = 1) {
        this.cell = cell;
        this.colspan = colspan;
        this.rowspan = rowspan;
    }
}

export class TableItemStorage {
    private _items: ArdTableRow[] = [];
    private _highlightedItems: ArdTableRow[] = [];
    private _selectedItems: ArdTableRow[] = [];

    private _dataColumns: DataColumn[] = [];
    private _headerCells: HeaderCell[][] = [];

    constructor(
        private _ardParentComp: TableItemStorageHost,
    ) { }

    /**
     * Gets all items.
     */
    get items(): ArdTableRow[] {
        return this._items;
    }
    /**
     * Gets all currently selected items.
     */
    get selectedItems(): ArdTableRow[] {
        return this._selectedItems;
    }
    /**
     * Gets all currently highlighted items.
     */
    get highlightedItems(): ArdTableRow[] {
        return this._highlightedItems;
    }
    /**
     * Gets the values of the currently selected items.
     */
    get value(): any[] {
        return this._itemsToValue(this.selectedItems);
    }
    /**
     * Maps an array of items into their values.
     * @param items The items to convert to value.
     * @returns An array of item values.
     */
    private _itemsToValue(items: ArdTableRow[]): any[] {
        return items.map(item => item.itemData);
    }

    /**
     * Returns true if at least one item is highlighted, otherwise false.
     */
    get isAnyItemHighlighted(): boolean {
        return this._highlightedItems.length > 0;
    }
    /**
     * Returns true if the parent component defines the limit of concurrently selectable items and the amount of currently selected items matches that limit. Otherwise returns false.
     * 
     * **TLDR**: true if `maxSelectedItems` is defined and the number of selected items matches that value.
     */
    get isItemLimitReached(): boolean {
        if (!isDefined(this._ardParentComp.maxSelectedItems)) {
            return false;
        }
        return this._ardParentComp.maxSelectedItems <= this.selectedItems.length;
    }

    /**
     * Gets the header cells of the table.
     * @returns a 2D array of header cells.
     */
    get headerCells(): HeaderCell[][] {
        return this._headerCells;
    }
    /**
     * Checks if the table has defined columns.
     * @returns a boolean value indicating if the table has defined columns.
     */
    get hasDefinedColumns(): boolean {
        return this._dataColumns.length > 0;
    }

    //! setting columns
    /**
     * Sets the columns of the table.
     * @param cols an array of table data columns or table subheaders.
     */
    setColumns(cols: (TableDataColumn | TableSubheader)[]): void {
        const maxNestingLevel = this._getHeaderMaxNesting(cols);
        const headerCells = this._mapColumnsToArray(cols, maxNestingLevel, 0);
        this._headerCells = this._filterHeaderCells(headerCells);
        this._dataColumns = this._extractDataSources(cols);
    }
    /**
     * Filters out null values from the header cells array.
     * @param cells a 2D array of header cells or null values.
     * @returns a 2D array of header cells without null values and empty arrays.
     */
    private _filterHeaderCells(cells: (HeaderCell | null)[][]): HeaderCell[][] {
        for (let i = 0; i < cells.length; i++) {
            cells[i] = cells[i].filter(v => v != null);
        }
        return cells.filter(row => row.length) as HeaderCell[][];
    }
    /**
     * Extracts the data sources from the columns array.
     * @param cols an array of table data columns or table subheaders.
     * @returns an array of table data columns.
     */
    private _extractDataSources(cols: (TableDataColumn | TableSubheader)[]): TableDataColumn[] {
        let dataColumns: TableDataColumn[] = [];
        
        for (const col of cols) {
            if (!isTableSubheader(col)) {
                dataColumns.push(col);
                continue;
            }
            dataColumns.push(...this._extractDataSources(col.children));
        }

        return dataColumns;
    }
    /**
     * Gets the maximum nesting level of the columns array.
     * @param cols an array of table data columns or table subheaders.
     * @returns the maximum nesting level as a number.
     */
    private _getHeaderMaxNesting(cols: (TableDataColumn | TableSubheader)[]): number {
        if (areAllDataColumns(cols)) return 1;
        let max = 1;
        for (const col of cols.filter(v => isTableSubheader(v)) as TableSubheader[]) {
            const height = 1 + this._getHeaderMaxNesting(col.children);
            if (height > max) max = height;
        }
        return max;
    }
    /**
     * Maps the columns tree to a 2D array of header cells or null values.
     * @param cols an array of table data columns or table subheaders.
     * @param maxNesting the maximum nesting level of the columns array.
     * @param currentNesting the current nesting level of the columns array.
     * @returns a 2D array of header cells or null values.
     */
    private _mapColumnsToArray(cols: (TableDataColumn | TableSubheader)[], maxNesting: number, currentNesting: number): (HeaderCell | null)[][] {
        if (areAllDataColumns(cols)) {
            return [
                cols.map(col => new HeaderCell(col, 1, maxNesting - currentNesting))
            ];
        }
        const headerCells: (HeaderCell | null)[][] = [[]];
        for (const col of cols) {
            if (!isTableSubheader(col)) {
                headerCells[0].push(new HeaderCell(col, 1, maxNesting - currentNesting))
                continue;
            }
            const childCells: (HeaderCell | null)[][] = [
                [],
                ...this._mapColumnsToArray(col.children, maxNesting, currentNesting + 1)
            ];
            const height = childCells.length - 1;
            const width = childCells[1].length;
            for (let i = 0; i < height; i++) {
                headerCells.push([null]);
            }
            headerCells[0].push(new HeaderCell(col, width, 1));
            for (let i = 0; i < width - 1; i++) {
                headerCells[0].push(null);
            }
            merge2dArrays(headerCells, childCells);
        }
        return headerCells;
    }
    
    //! setting items
    /**
     * Sets the component's items. Takes into account the values defined by the parent component for `rowDisabledFrom`, `rowBoldFrom`, and `rowHighlightedFrom`.
     * @param items An array of items to be set as the component's items.
     */
    setItems(items: any[]): void {
        if (!this.hasDefinedColumns) return;

        this._items = items.map((item, index) => {
            return this._setItemsMapFn(item, index);
        });
    }
    /**
     * Maps raw item data to an {@link ArdTableRow} object.
     *
     * @param {any} rawItemData - The raw data of the item.
     * @param {number} index - The index of the item.
     * @returns {ArdTableRow} Returns an ArdTableRow object with mapped properties.
     * @private
     */
    private _setItemsMapFn(rawItemData: any, index: number): ArdTableRow {
        //get data
        const [data, dataColumns] = this._getRowData(rawItemData, index);

        //get bold
        const rowBoldFromPath = this._ardParentComp.rowBoldFrom ?? this._ardParentComp.DEFAULTS.rowBoldFrom;
        const bold = resolvePath(rawItemData, rowBoldFromPath);

        //get disabled
        const disabledPath = this._ardParentComp.rowDisabledFrom ?? this._ardParentComp.DEFAULTS.rowDisabledFrom;
        let disabled = evaluate(resolvePath(rawItemData, disabledPath));
        if (this._ardParentComp.invertDisabled) {
            disabled = !disabled;
        }

        //return
        return {
            itemData: rawItemData,
            index,
            data,
            dataColumns,
            disabled,
            bold,
        }
    }
    /**
     * Retrieves data for a row based on data columns configuration.
     *
     * @param {any} rawItemData - The raw data of the item.
     * @param {number} index - The index of the item.
     * @returns {any[]} Returns an array containing the row data.
     * @private
     */
    private _getRowData(rawItemData: any, index: number): [any[], TableDataColumn[]] {
        let data: any[] = [];
        for (const dataColumn of this._dataColumns) {
            const sourcePath = dataColumn.dataSource;

            if (typeof sourcePath == 'string') {
                console.log(sourcePath, this._ardParentComp);
                if (this._ardParentComp.treatDataSourceAsString) {
                    data.push(rawItemData[sourcePath]);
                    continue;
                }
                data.push(resolvePath(rawItemData, sourcePath));
                continue;
            }
            if (sourcePath.type == 'autocount') {
                data.push(index + 1);
                continue;
            }
            if (sourcePath.type == 'checkbox') {
                data.push({ _ardCheckbox: true, index });
                continue;
            }
            const sourceString = typeof sourcePath == 'object' ? JSON.stringify(sourcePath) : sourcePath;
            console.error(new Error(`Unexpected data source "${sourceString}".`));
        }
        return [data, this._dataColumns];
    }
    /**
     * Writes a new value to the item storage. Selects the correct items based on the provided values, warning the user if the value is not found.
     * @param indexes The value of the ngModel to set.
     */
    writeValue(indexes: number[]): void {
        this._forceUnselectAll();
        this.selectItem(...indexes);
    }

    //! selecting items
    /**
     * Checks if an item with the given index is selected.
     *
     * @param {number} index The index of the item to check.
     * @returns {boolean} _true_ if the item is selected, otherwise _false_.
     */
    isItemSelected(index: number): boolean {
        return this._selectedItems.some(item => item.index == index);
    }
    /**
     * Unselects all selected items.
     * 
     * If the parent component requires at least one value to be selected at all times, the first selected items is left selected.
     * @returns An array of items cleared, mapped to only their values.
     */
    unselectAll(): any[] {
        for (const item of this._selectedItems) {
            item.selected = false;
        }

        const ret = this._itemsToValue(this._selectedItems);

        this._selectedItems = [];

        return ret;
    }
    /**
     * Unselects all selected items, no matter what the component settings are.
     * @returns An array of items cleared, mapped to only their values.
     */
    private _forceUnselectAll(): any[] {
        for (const item of this._selectedItems) {
            item.selected = false;
        }

        const ret = this._itemsToValue(this._selectedItems);

        this._selectedItems = [];

        return ret;
    }
    /**
     * Selects one or multiple items.
     * 
     * Accounts for the limit of concurrently selected items defined by the parent component.
     * 
     * @param indexes A rest operator array of item indexes to be selected.
     * @returns a tuple containing two arrays:
     * * An array of items selected.
     * * An array of items unselected.
     */
    selectItem(...indexes: number[]): [any[], any[]] {
        const itemsToBeSelected = this._items.filter(item => indexes.includes(item.index));
        if (this.isItemLimitReached) {
            return [[], this._itemsToValue(itemsToBeSelected)];
        }

        let itemsSelectedCount = 0;
        const itemsSelected = [];
        for (const item of itemsToBeSelected) {
            itemsSelectedCount++;
            if (item.selected) continue;
            if (this.isItemLimitReached) {
                break;
            }
            item.selected = true;
            this._selectedItems.push(item);
            itemsSelected.push(item);
        }

        const itemsFailedToSelect = itemsToBeSelected.slice(itemsSelectedCount - 1);
        return [this._itemsToValue(itemsSelected), this._itemsToValue(itemsFailedToSelect)];
    }
    /**
     * Unselects one or multiple items.
     * @param items A rest operator array of item indexes to be unselected.
     * @returns An array of items unselected, mapped to only their values.
     */
    unselectItem(...indexes: number[]): any[] {
        const itemsToBeSelected = this._items.filter(item => indexes.includes(item.index));
        for (const item of itemsToBeSelected) {
            item.selected = false;
        }
        this._selectedItems = this._selectedItems.filter(v => v.selected);

        return this._itemsToValue(itemsToBeSelected);
    }

    //! highlighting items
    /**
     * Unhighlights all currently highlighted items.
     */
    unhighlightAll(): void {
        for (const item of this._highlightedItems) {
            item.highlighted = false;
        }
        this._highlightedItems = [];
    }
    /**
     * Highlights the given item, while unhighlighting all other items. Does nothing when the item is disabled.
     * @param item The index of the item to be highlighted.
     * @returns The highlighted item.
     */
    highlightSingleItem(index: number): ArdTableRow | null {
        this.unhighlightAll();
        return this.highlightItem(index);
    }
    /**
     * Highlights all given items.
     * @param items A rest operator array of item indexes to be highlighted.
     * @returns The last highlighted item.
     */
    highlightItem(...indexes: number[]): ArdTableRow {
        const items = this._items.filter(item => indexes.includes(item.index));
        for (const item of items) {
            item.highlighted = true;
        }
        this._highlightedItems.push(...items);
        return items.last();
    }
    /**
     * Unhighlights all given items.
     * @param items A rest operator array of item indexes to be unhighlighted.
     */
    unhighlightItem(...indexes: number[]): void {
        const items = this._items.filter(item => indexes.includes(item.index));
        for (const item of items) {
            if (!item || !item.highlighted) return;

            item.highlighted = false;
        }
        this._highlightedItems = this._highlightedItems.filter(v => v.highlighted);
    }
    /**
     * Highlights the first item out of all items.
     * @returns The highlighted item.
     */
    highlightFirstItem(): ArdTableRow | null {
        this.unhighlightAll();

        let itemToHighlight = this._getHiglightableItems().first().index;
        return this.highlightItem(itemToHighlight);
    }
    /**
     * Highlights the last item out of all items.
     * @returns The highlighted item.
     */
    highlightLastItem(): ArdTableRow | null {
        this.unhighlightAll();

        let itemToHighlight = this._getHiglightableItems().last().index;
        return this.highlightItem(itemToHighlight);
    }
    /**
     * Highlights all non-disabled items.
     */
    highlightAllItems(): void {
        let itemsToHighlight = this._getHiglightableItems().map(v => v.index);

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
    highlightNextItem(offset: number, hasShift?: boolean): ArdTableRow | null {
        if (!this.isAnyItemHighlighted) {
            return this.highlightFirstItem();
        }
        const currentItem = this.highlightedItems.last();
        const itemsWithoutDisabled = this._items.filter(item => !item.disabled && (!this.isItemLimitReached || item.selected));
        const currentIndexInItems = itemsWithoutDisabled.findIndex(item => item.index == currentItem.index);

        let nextItemIndex = currentIndexInItems + offset;
        if (nextItemIndex >= itemsWithoutDisabled.length) {
            nextItemIndex -= itemsWithoutDisabled.length;
        }
        if (nextItemIndex < 0) {
            nextItemIndex += itemsWithoutDisabled.length;
        }
        const itemToHighlight = itemsWithoutDisabled[nextItemIndex];

        if (hasShift) {
            if (itemToHighlight.highlighted) {
                this.unhighlightItem(nextItemIndex);
            }
            return this.highlightItem(nextItemIndex);
        }
        return this.highlightSingleItem(nextItemIndex);
    }
    /**
     * Finds all highlightable items. An item is considered highlightable if it is **not** disabled.
     * @returns An array of all highlightable items.
     */
    private _getHiglightableItems(): ArdTableRow[] {
        return this._items.filter(item => !item.disabled);
    }
}