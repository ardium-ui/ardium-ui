import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { ArdTableRow, HeaderCell, TableItemStorage, TableItemStorageHost } from './table-item-storage';
import { ArdiumTableCheckboxTemplateDirective, ArdiumTableTemplateDirective } from './table.directives';
import { TableCheckboxContext, TableDataColumn, TableSubheader } from './table.types';

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
