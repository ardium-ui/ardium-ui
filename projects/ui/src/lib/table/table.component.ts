import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { ComponentColor, SimpleComponentColor } from '../types/colors.types';
import { ArdTableRow, HeaderCell, TableItemStorage, TableItemStorageHost } from './table-item-storage';
import { ArdiumTableCheckboxTemplateDirective, ArdiumTableHeaderCheckboxTemplateDirective, ArdiumTableTemplateDirective } from './table.directives';
import { TableAlignType, TableAppearance, TableCheckboxContext, TableDataColumn, TableHeaderCheckboxContext, TableSubheader, TableVariant } from './table.types';
import { isTableSubheader } from './utils';
import { CheckboxState } from '../checkbox/checkbox.types';

@Component({
  selector: 'ard-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumTableComponent extends _FocusableComponentBase implements TableItemStorageHost, AfterContentInit {
    
    private readonly _itemStorage = new TableItemStorage(this);
    private _isMouseBeingUsed = false;

    readonly DEFAULTS = {
        rowDisabledFrom: 'rowDisabled',
        rowBoldFrom: 'rowBold',
    }

    @Input() rowDisabledFrom?: string; 
    @Input() rowBoldFrom?: string;
    
    private _selectableRows: boolean = false;
    @Input()
    get selectableRows(): boolean { return this._selectableRows; }
    set selectableRows(v: any) { this._selectableRows = coerceBooleanProperty(v); }

    //! appearance
    @Input() appearance: TableAppearance = TableAppearance.Strong;
    @Input() variant: TableVariant = TableVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.Primary;
    @Input() align: TableAlignType = TableAlignType.CenterLeft;
    @Input() headerAlign: TableAlignType = TableAlignType.CenterLeft;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    private _zebra: boolean = false;
    @Input()
    get zebra(): boolean { return this._zebra; }
    set zebra(v: any) { this._zebra = coerceBooleanProperty(v); }

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
        ].join(' ');
    }

    //! item storage getters
    get headerCells(): HeaderCell[][] {
        return this._itemStorage.headerCells;
    }
    get dataRows(): ArdTableRow[] {
        return this._itemStorage.items;
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
    get data(): any[] { return this._data; }

    private _treatDataSourceAsString: boolean = false;
    @Input()
    get treatDataSourceAsString(): boolean { return this._treatDataSourceAsString; }
    set treatDataSourceAsString(v: any) { this._treatDataSourceAsString = coerceBooleanProperty(v); }

    //! templates
    @ContentChild(ArdiumTableCheckboxTemplateDirective, { read: TemplateRef }) checkboxTemplate?: TemplateRef<TableCheckboxContext>;
    @ContentChild(ArdiumTableHeaderCheckboxTemplateDirective, { read: TemplateRef }) headerCheckboxTemplate?: TemplateRef<TableHeaderCheckboxContext>;

    private _itemTemplates: { [key: string]: TemplateRef<any>; } = {};
    @ContentChildren(ArdiumTableTemplateDirective) templateChildren!: QueryList<ArdiumTableTemplateDirective>;

    ngAfterContentInit(): void {
        const templates = Array.from(this.templateChildren);
        for (const instance of templates) {
            if (!instance.name) {
                console.error(new Error('[ard-table-tmp] requires a value to be specified.'));
                continue;
            }
            this._itemTemplates[instance.name] = instance.template;
        }
    }

    getHeaderTemplate(tmp: string | { template: string | TemplateRef<any> }): TemplateRef<any> | undefined {
        if (typeof tmp == 'string') return undefined;
        return this.getCellTemplate(tmp.template);
    }
    getHeaderCheckboxColor(): SimpleComponentColor {
        if (this.appearance == TableAppearance.Strong) return SimpleComponentColor.CurrentColor;
        return this.color;
    }
    getCellTemplate(tmp?: string | TemplateRef<any>): TemplateRef<any> | undefined {
        //return undefined
        if (!tmp) return undefined;
        //return template, if it is one
        if (tmp instanceof TemplateRef) return tmp;
        //check if the name can be found
        if (!(tmp in this._itemTemplates)) {
            console.error(new Error(`<ard-table> error: cannot find template named "${tmp}"`));
            return undefined;
        }
        //return the template
        return this._itemTemplates[tmp];
    }
    getCellStyle(cell: TableDataColumn | TableSubheader): string {
        if (isTableSubheader(cell)) return 'width:unset;min-width:unset';
        const width = typeof cell.width == 'number' ? `${cell.width}px` : cell.width;
        const minWidth = typeof cell.minWidth == 'number' ? `${cell.minWidth}px` : cell.minWidth;
        return [
            `width:${width ?? 'unset'}`,
            `min-width:${minWidth ?? 'unset'}`,
        ].join(';');
    }

    //! click & hover handlers
    onCheckboxClick(index: number, event: MouseEvent): void {
        event.stopPropagation();
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
        console.log('toggle row selected', index, this._itemStorage.isItemSelected(index));
        if (this._itemStorage.isItemSelected(index)) {
            const unselected = this._itemStorage.unselectItem(index);
            this.unselectRowEvent.emit(unselected);
        }
        else {
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
        }
        else {
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
        return typeof cell == 'object' && '_ardCheckbox' in cell && 'index' in cell;
    }
    isHeaderCellCheckbox(cell: HeaderCell): boolean {
        const dataCell = cell.cell;
        if (isTableSubheader(dataCell)) return false;
        if (typeof dataCell.dataSource == 'string') return false;
        return dataCell.dataSource.type == 'checkbox';
    }

    @Output('selectedRowsChange') selectedRowsChangeEvent = new EventEmitter<any[]>();
    @Output('failedSelectRow') failedSelectRowEvent = new EventEmitter<any[]>();
    @Output('selectRow') selectRowEvent = new EventEmitter<any[]>();
    @Output('unselectRow') unselectRowEvent = new EventEmitter<any[]>();

    //! contexts
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
            }
        }
    }
    getCheckboxContext(index: number): TableCheckboxContext {
        const selected = this._itemStorage.isItemSelected(index);
        return {
            $implicit: selected,
            selected,
            onChange: (event: MouseEvent) => {
                this.onCheckboxClick(index, event);
            }
        }
    }
}
