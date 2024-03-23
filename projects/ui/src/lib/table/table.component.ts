import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isDefined } from 'simple-bool';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { CheckboxState } from '../checkbox/checkbox.types';
import {
    CurrentItemsFormatFn,
    PaginationAlign,
} from '../table-pagination/table-pagination.types';
import { ComponentColor, SimpleComponentColor } from '../types/colors.types';
import {
    ArdTableRow,
    HeaderCell,
    TableItemStorage,
    TableItemStorageHost,
} from './table-item-storage';
import {
    ArdiumTableCaptionTemplateDirective,
    ArdiumTableCheckboxTemplateDirective,
    ArdiumTableHeaderCheckboxTemplateDirective,
    ArdiumTableTemplateDirective,
} from './table.directives';
import {
    SortType,
    TableAlignType,
    TableAppearance,
    TableCaptionContext,
    TableCheckboxContext,
    TableDataColumn,
    TableHeaderCheckboxContext,
    TableHeaderContext,
    TablePaginationStrategy,
    TableSubheader,
    TableVariant,
    TableSubheaderContext,
} from './table.types';
import { isTableSubheader } from './utils';

@Component({
    selector: 'ard-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTableComponent
    extends _FocusableComponentBase
    implements TableItemStorageHost, AfterContentInit
{
    private readonly _itemStorage = new TableItemStorage(this);

    readonly DEFAULTS = {
        rowDisabledFrom: 'disabled',
        rowBoldFrom: 'bold',
    };

    @Input() rowDisabledFrom?: string;
    @Input() rowBoldFrom?: string;

    private _invertRowDisabled: boolean = false;
    @Input()
    get invertRowDisabled(): boolean {
        return this._invertRowDisabled;
    }
    set invertRowDisabled(v: any) {
        this._invertRowDisabled = coerceBooleanProperty(v);
    }

    private _invertRowBold: boolean = false;
    @Input()
    get invertRowBold(): boolean {
        return this._invertRowBold;
    }
    set invertRowBold(v: any) {
        this._invertRowBold = coerceBooleanProperty(v);
    }

    private _selectableRows: boolean = false;
    @Input()
    get selectableRows(): boolean {
        return this._selectableRows;
    }
    set selectableRows(v: any) {
        this._selectableRows = coerceBooleanProperty(v);
    }

    @Input() caption?: string;

    @Input() isLoading?: boolean;
    @Input() loadingProgress?: number; //TODO add progress bar

    //! appearance
    @Input() appearance: TableAppearance = TableAppearance.Strong;
    @Input() variant: TableVariant = TableVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.Primary;
    @Input() align: TableAlignType = TableAlignType.CenterLeft;
    @Input() headerAlign: TableAlignType = TableAlignType.CenterLeft;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean {
        return this._compact;
    }
    set compact(v: any) {
        this._compact = coerceBooleanProperty(v);
    }

    private _zebra: boolean = false;
    @Input()
    get zebra(): boolean {
        return this._zebra;
    }
    set zebra(v: any) {
        this._zebra = coerceBooleanProperty(v);
    }

    private _stickyHeader: boolean = false;
    @Input()
    get stickyHeader(): boolean {
        return this._stickyHeader;
    }
    set stickyHeader(v: any) {
        this._stickyHeader = coerceBooleanProperty(v);
    }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            `ard-color-${this.color}`,
            `ard-align-${this.align}`,
            `ard-header-align-${this.headerAlign}`,
            this.compact ? 'ard-compact' : '',
            this.zebra ? 'ard-zebra-table' : '',
            this.selectableRows ? 'ard-selectable-rows' : '',
            this.stickyHeader ? 'ard-sticky-header' : '',
            this.isLoading ? 'ard-table-loading' : '',
        ].join(' ');
    }

    //! pagination
    private _paginated: boolean = false;
    @Input()
    get paginated(): boolean {
        return this._paginated;
    }
    set paginated(v: any) {
        this._paginated = coerceBooleanProperty(v);
    }

    @Input() paginationStrategy: TablePaginationStrategy =
        TablePaginationStrategy.Noop;

    @Input() paginationOptions: number[] | { value: number; label: string }[] =
        [10, 25, 50];
    @Input() totalItems?: number;
    @Input() paginationColor: ComponentColor = ComponentColor.None;
    @Input() paginationAlign: PaginationAlign = PaginationAlign.Split;
    @Input() itemsPerPageText: string = 'Items per page:';
    @Input() currentItemsFormatFn: CurrentItemsFormatFn = ({
        currentItemsFirst,
        currentItemsLast,
        totalItems,
    }) => {
        return `${currentItemsFirst} – ${currentItemsLast} of ${totalItems}`;
    };

    private _pageFillRemaining: boolean = false;
    @Input()
    get pageFillRemaining(): boolean {
        return this._pageFillRemaining;
    }
    set pageFillRemaining(v: any) {
        this._pageFillRemaining = coerceBooleanProperty(v);
    }

    private _paginationDisabled: boolean = false;
    @Input()
    get paginationDisabled(): boolean {
        return this._paginationDisabled;
    }
    set paginationDisabled(v: any) {
        this._paginationDisabled = coerceBooleanProperty(v);
    }

    private _useFirstLastButtons: boolean = false;
    @Input()
    get useFirstLastButtons(): boolean {
        return this._useFirstLastButtons;
    }
    set useFirstLastButtons(v: any) {
        this._useFirstLastButtons = coerceBooleanProperty(v);
    }

    private _itemsPerPage: number = 50;
    @Input()
    get itemsPerPage(): number {
        return this._itemsPerPage;
    }
    set itemsPerPage(v: any) {
        this._itemsPerPage = coerceNumberProperty(v);
    }
    @Output() itemsPerPageChange = new EventEmitter<number>();

    private _page: number = 1;
    @Input()
    get page(): number {
        return this._page;
    }
    set page(v: any) {
        this._page = coerceNumberProperty(v);
    }
    @Output() pageChange = new EventEmitter<number>();

    get isDefinedTotalItems(): boolean {
        return (
            (this.paginationStrategy == TablePaginationStrategy.Noop &&
                isDefined(this.totalItems)) ||
            this.paginationStrategy != TablePaginationStrategy.Noop
        );
    }
    get canDisplayPagination(): boolean {
        //prettier-ignore
        return this.paginated && this.isDefinedTotalItems;
    }

    //! item storage getters
    get headerCells(): HeaderCell[][] {
        return this._itemStorage.headerCells;
    }
    get dataRows(): ArdTableRow[] {
        const items: ArdTableRow[] = this._itemStorage.paginatedItems;

        if (!this.pageFillRemaining) return items;
        if (!this.isDefinedTotalItems) {
            throw new Error('<ard-table> requires [totalItems] to be defined.');
        }
        if (this.page == 1) return items;
        for (let i = items.length; i < this.itemsPerPage; i++) {
            items.push({
                itemData: null,
                index: i,
                data: [],
                dataColumns: [],
                isEmpty: true,
            });
        }
        return items;
    }

    //! columns/data setters
    @Input()
    set columns(v: (TableDataColumn | TableSubheader)[]) {
        this._itemStorage.setColumns(v);
    }
    private _data: any[] = [];
    @Input()
    set data(v: any[]) {
        this._data = v;
        this._itemStorage.setItems(v);
    }
    get data(): any[] {
        return this._data;
    }

    private _treatDataSourceAsString: boolean = false;
    @Input()
    get treatDataSourceAsString(): boolean {
        return this._treatDataSourceAsString;
    }
    set treatDataSourceAsString(v: any) {
        this._treatDataSourceAsString = coerceBooleanProperty(v);
    }

    //! templates
    @ContentChild(ArdiumTableCheckboxTemplateDirective, { read: TemplateRef })
    checkboxTemplate?: TemplateRef<TableCheckboxContext>;
    @ContentChild(ArdiumTableHeaderCheckboxTemplateDirective, {
        read: TemplateRef,
    })
    headerCheckboxTemplate?: TemplateRef<TableHeaderCheckboxContext>;
    @ContentChild(ArdiumTableCaptionTemplateDirective, { read: TemplateRef })
    captionTemplate?: TemplateRef<TableCaptionContext>;

    private _itemTemplates: { [key: string]: TemplateRef<any> } = {};
    @ContentChildren(ArdiumTableTemplateDirective)
    templateChildren!: QueryList<ArdiumTableTemplateDirective>;

    ngAfterContentInit(): void {
        const templates = Array.from(this.templateChildren);
        for (const instance of templates) {
            if (!instance.name) {
                console.error(
                    new Error(
                        '[ard-table-tmp] requires a value to be specified.',
                    ),
                );
                continue;
            }
            this._itemTemplates[instance.name] = instance.template;
        }
    }

    getHeaderTemplate(
        tmp: string | { template: string | TemplateRef<any> },
    ): TemplateRef<any> | undefined {
        if (typeof tmp == 'string') return undefined;
        return this.getCellTemplate(tmp.template);
    }
    getHeaderCheckboxColor(): SimpleComponentColor {
        if (this.appearance == TableAppearance.Strong)
            return SimpleComponentColor.CurrentColor;
        return this.color;
    }
    getCellTemplate(
        tmp?: string | TemplateRef<any>,
    ): TemplateRef<any> | undefined {
        //return undefined
        if (!tmp) return undefined;
        //return template, if it is one
        if (tmp instanceof TemplateRef) return tmp;
        //check if the name can be found
        if (!(tmp in this._itemTemplates)) {
            console.error(
                new Error(
                    `<ard-table> error: cannot find template named "${tmp}"`,
                ),
            );
            return undefined;
        }
        //return the template
        return this._itemTemplates[tmp];
    }
    getCellStyle(cell: TableDataColumn | TableSubheader): string {
        if (isTableSubheader(cell)) return 'width:unset;min-width:unset';
        const width =
            typeof cell.width == 'number' ? `${cell.width}px` : cell.width;
        const minWidth =
            typeof cell.minWidth == 'number'
                ? `${cell.minWidth}px`
                : cell.minWidth;
        return [
            `width:${width ?? 'unset'}`,
            `min-width:${minWidth ?? 'unset'}`,
        ].join(';');
    }

    //! click & hover handlers
    onCheckboxClick(index: number): void {
        this.toggleRowSelected(index);
    }
    onRowClick(index: number, event: MouseEvent): void {
        if (!this.selectableRows) return;
        event.stopPropagation();
        this.toggleRowSelected(index);
    }
    onRowMouseOver(event: MouseEvent): void {
        event.stopPropagation();
    }
    onRowMouseEnter(index: number, event: MouseEvent): void {
        if (!this.selectableRows) return;
        event.stopPropagation();
        this._itemStorage.highlightSingleItem(index);
    }
    onRowMouseLeave(index: number, event: MouseEvent): void {
        if (!this.selectableRows) return;
        event.stopPropagation();
        this._itemStorage.unhighlightItem(index);
    }

    //! select handlers
    /**
     * Toggles the selection state of a row in the table.
     * @param selected a boolean value indicating if the row is currently selected.
     * @param index the index of the row in the table.
     */
    toggleRowSelected(index: number): void {
        if (this._itemStorage.isItemSelected(index)) {
            const unselected = this._itemStorage.unselectItem(index);
            this.unselectRowEvent.emit(unselected);
        } else {
            const [selected, failed] = this._itemStorage.selectItem(index);
            this.selectRowEvent.emit(selected);
            this.failedSelectRowEvent.emit(failed);
        }
        this._emitSelect();
    }
    /**
     * Toggles the selection state of all rows in the table.
     */
    toggleAllRowsSelected(): void {
        if (this._itemStorage.areAllSelected) {
            const unselected = this._itemStorage.unselectAll();
            this.unselectRowEvent.emit(unselected);
        } else {
            const [selected, failed] = this._itemStorage.selectAll();
            this.selectRowEvent.emit(selected);
            this.failedSelectRowEvent.emit(failed);
        }
        this._emitSelect();
    }
    private _emitSelect(): void {
        const v = this._itemStorage.value;
        this.selectedRowsChangeEvent.emit(v);
    }
    isCellCheckbox(cell: any): boolean {
        return (
            typeof cell == 'object' && '_ardCheckbox' in cell && 'index' in cell
        );
    }
    isHeaderCellCheckbox(cell: HeaderCell): boolean {
        const dataCell = cell.cell;
        if (isTableSubheader(dataCell)) return false;
        if (typeof dataCell.dataSource == 'string') return false;
        return dataCell.dataSource.type == 'checkbox';
    }
    isHeaderCellSortable(cell: HeaderCell): boolean {
        const dataCell = cell.cell;
        if (isTableSubheader(dataCell)) return false;
        return dataCell.sortable ?? false;
    }

    @Output('selectedRowsChange') selectedRowsChangeEvent = new EventEmitter<
        any[]
    >();
    @Output('failedSelectRow') failedSelectRowEvent = new EventEmitter<any[]>();
    @Output('selectRow') selectRowEvent = new EventEmitter<any[]>();
    @Output('unselectRow') unselectRowEvent = new EventEmitter<any[]>();

    //! contexts
    getHeaderContext(
        cell: TableDataColumn,
        index: number,
    ): TableHeaderContext | null;
    getHeaderContext(
        cell: TableSubheader,
        index: number,
    ): TableSubheaderContext | null;
    getHeaderContext(
        cell: TableDataColumn | TableSubheader,
        index: number,
    ): TableHeaderContext | TableSubheaderContext | null;
    getHeaderContext(
        cell: TableDataColumn | TableSubheader,
        index: number,
    ): TableHeaderContext | TableSubheaderContext | null {
        if (typeof cell.header != 'string') return null;
        if (isTableSubheader(cell))
            return {
                $implicit: cell.header,
                header: cell.header,
            };
        return {
            $implicit: cell.header,
            header: cell.header,
            sortable: cell.sortable ?? false,
            sortType: this._itemStorage.getColumnSortType(index),
            onTriggerSort: (event?: Event) =>
                this._itemStorage.toggleCurrentSortColumn(index),
            onTriggerResetSort: (event?: Event) => {
                this._itemStorage.resetSort();
                event?.preventDefault();
                event?.stopPropagation();
            },
        };
    }
    getHeaderCheckboxContext(): TableHeaderCheckboxContext {
        let state: CheckboxState = CheckboxState.Unselected;
        if (this._itemStorage.isAnyItemSelected) {
            state = CheckboxState.Indeterminate;
            if (this._itemStorage.areAllSelected) {
                state = CheckboxState.Selected;
            }
        }
        return {
            $implicit: state,
            state,
            onChange: () => {
                this.toggleAllRowsSelected();
            },
        };
    }
    getCheckboxContext(index: number): TableCheckboxContext {
        const item = this._itemStorage.items.find((v) => v.index == index)!;
        const selected = item.selected ?? false;
        const disabled = item.disabled ?? false;
        return {
            $implicit: selected,
            selected,
            disabled,
            onChange: () => {
                this.onCheckboxClick(index);
            },
        };
    }
}
