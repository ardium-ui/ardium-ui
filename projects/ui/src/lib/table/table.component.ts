import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { ComponentColor } from '../types/colors.types';
import { ArdTableRow, HeaderCell, TableItemStorage, TableItemStorageHost } from './table-item-storage';
import { ArdiumTableCheckboxTemplateDirective, ArdiumTableTemplateDirective } from './table.directives';
import { TableAlignType, TableAppearance, TableCheckboxContext, TableDataColumn, TableSubheader, TableVariant } from './table.types';
import { isTableSubheader } from './utils';

@Component({
  selector: 'ard-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumTableComponent extends _FocusableComponentBase implements TableItemStorageHost, AfterContentInit {
    
    private readonly _itemStorage = new TableItemStorage(this);

    readonly DEFAULTS = {
        rowDisabledFrom: 'rowDisabled',
        rowBoldFrom: 'rowBold',
    }

    @Input() rowDisabledFrom?: string; 
    @Input() rowBoldFrom?: string;

    //! appearance
    @Input() appearance: TableAppearance = TableAppearance.Strong;
    @Input() variant: TableVariant = TableVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.Primary;
    @Input() align: TableAlignType = TableAlignType.CenterLeft;
    @Input() headerAlign: TableAlignType = TableAlignType.Center;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            `ard-color-${this.color}`,
            `ard-align-${this.align}`,
            `ard-header-align-${this.headerAlign}`,
            this.compact ? 'ard-compact' : '',
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
        console.log(cell);
        if (isTableSubheader(cell)) return 'width:unset;min-width:unset';
        const width = typeof cell.width == 'number' ? `${cell.width}px` : cell.width;
        const minWidth = typeof cell.minWidth == 'number' ? `${cell.minWidth}px` : cell.minWidth;
        return [
            `width:${width ?? 'unset'}`,
            `min-width:${minWidth ?? 'unset'}`,
        ].join(';');
    }

    //! select handlers
    toggleRowSelected(selected: boolean, index: number): void {
        if (selected) {
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
    private _emitSelect(): void {
        const v = this._itemStorage.value;
        this.selectedRowsChangeEvent.emit(v);
    }
    isCellCheckbox(cell: any): boolean {
        return typeof cell == 'object' && '_ardCheckbox' in cell && 'index' in cell;
    }

    @Output('selectedRowsChange') selectedRowsChangeEvent = new EventEmitter<any[]>();
    @Output('failedSelectRow') failedSelectRowEvent = new EventEmitter<any[]>();
    @Output('selectRow') selectRowEvent = new EventEmitter<any[]>();
    @Output('unselectRow') unselectRowEvent = new EventEmitter<any[]>();

    //! contexts
    getCheckboxContext(index: number): TableCheckboxContext {
        const selected = this._itemStorage.isItemSelected(index);
        return {
            $implicit: selected,
            selected,
            onChange: () => {
                this.toggleRowSelected(selected, index);
            }
        }
    }
}
