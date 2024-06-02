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
  computed,
  contentChild,
  contentChildren,
  input,
  model,
  output,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isDefined } from 'simple-bool';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { CheckboxState } from '../checkbox/checkbox.types';
import { CurrentItemsFormatFn, PaginationAlign } from '../table-pagination/table-pagination.types';
import { ComponentColor, SimpleComponentColor } from '../types/colors.types';
import { ArdTableRow, HeaderCell, TableItemStorage, TableItemStorageHost } from './table-item-storage';
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
import { Nullable } from '../types/utility.types';

@Component({
  selector: 'ard-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTableComponent extends _FocusableComponentBase implements TableItemStorageHost, AfterContentInit {
  private readonly _itemStorage = new TableItemStorage(this);

  readonly DEFAULTS = {
    rowDisabledFrom: 'disabled',
    rowBoldFrom: 'bold',
  };

  readonly rowDisabledFrom = input<Nullable<string>>(undefined);
  readonly rowBoldFrom = input<Nullable<string>>(undefined);

  readonly invertRowDisabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly invertRowBold = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly selectableRows = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly maxSelectedItems = input<number, any>(0, { transform: v => coerceNumberProperty(v, 0) });

  readonly caption = input<Nullable<string>>(undefined);

  readonly isLoading = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly loadingProgress = input<number, any>(0, { transform: v => coerceNumberProperty(v, 0) }); //TODO add progress bar

  //! appearance
  readonly appearance = input<TableAppearance>(TableAppearance.Strong);
  readonly variant = input<TableVariant>(TableVariant.Rounded);
  readonly color = input<ComponentColor>(ComponentColor.Primary);
  readonly align = input<TableAlignType>(TableAlignType.CenterLeft);
  readonly headerAlign = input<TableAlignType>(TableAlignType.CenterLeft);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly zebra = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly stickyHeader = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-color-${this.color()}`,
      `ard-align-${this.align()}`,
      `ard-header-align-${this.headerAlign()}`,
      this.compact() ? 'ard-compact' : '',
      this.zebra() ? 'ard-zebra-table' : '',
      this.selectableRows() ? 'ard-selectable-rows' : '',
      this.stickyHeader() ? 'ard-sticky-header' : '',
      this.isLoading() ? 'ard-table-loading' : '',
    ].join(' ')
  );

  //! pagination
  readonly paginated = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly paginationStrategy = input<TablePaginationStrategy>(TablePaginationStrategy.Noop);

  readonly paginationOptions = input<number[] | { value: number; label: string }[]>([10, 25, 50]);
  readonly totalItems = input<Nullable<number>, any>(undefined, { transform: v => coerceNumberProperty(v, undefined) });
  readonly paginationColor = input<ComponentColor>(ComponentColor.None);
  readonly paginationAlign = input<PaginationAlign>(PaginationAlign.Split);
  readonly itemsPerPageText = input<string>('Items per page:');
  readonly currentItemsFormatFn = input<CurrentItemsFormatFn>(
    ({ currentItemsFirst, currentItemsLast, totalItems }) => `${currentItemsFirst} – ${currentItemsLast} of ${totalItems}`
  );

  readonly pageFillRemaining = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly paginationDisabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly useFirstLastButtons = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly itemsPerPage = model<number>(50);
  readonly page = model<number>(50);

  readonly isDefinedTotalItems = computed(() => this.paginationStrategy() != TablePaginationStrategy.Noop || isDefined(this.totalItems()));
  readonly canDisplayPagination = computed(() => this.paginated() && this.isDefinedTotalItems());

  //! item storage getters
  readonly headerCells = computed(() => this._itemStorage.headerCells());

  readonly dataRows = computed(() => {
    const items: ArdTableRow[] = this._itemStorage.paginatedItems();

    if (!this.pageFillRemaining()) return items;
    if (!this.isDefinedTotalItems()) {
      throw new Error('<ard-table> requires [totalItems] to be defined when using "slice" pagination strategy.'); //TODO error
    }
    if (this.page() == 1) return items;

    const ipp = this.itemsPerPage();
    for (let i = items.length; i < ipp; i++) {
      items.push(ArdTableRow.newEmptyCell(i));
    }
    return items;
  });

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

  readonly treatDataSourceAsString = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! templates
  readonly checkboxTemplate = contentChild<ArdiumTableCheckboxTemplateDirective, TemplateRef<TableCheckboxContext>>(ArdiumTableCheckboxTemplateDirective, {
    read: TemplateRef<TableCheckboxContext>,
  });
  readonly headerCheckboxTemplate = contentChild<ArdiumTableHeaderCheckboxTemplateDirective, TemplateRef<TableHeaderCheckboxContext>>(
    ArdiumTableHeaderCheckboxTemplateDirective,
    {
      read: TemplateRef<TableHeaderCheckboxContext>,
    }
  );
  readonly captionTemplate = contentChild<ArdiumTableCaptionTemplateDirective, TemplateRef<TableCaptionContext>>(ArdiumTableCaptionTemplateDirective, {
    read: TemplateRef<TableCaptionContext>,
  });

  private _itemTemplates: { [key: string]: TemplateRef<any> } = {};
  readonly templateChildren = contentChildren<ArdiumTableTemplateDirective>(ArdiumTableTemplateDirective);

  ngAfterContentInit(): void {
    const templates = Array.from(this.templateChildren());
    for (const instance of templates) {
      const name = instance.name();
      if (!name) {
        console.error(new Error('[ard-table-tmp] requires a value to be specified.')); //TODO
        continue;
      }
      this._itemTemplates[name] = instance.template;
    }
  }

  getHeaderTemplate(tmp: string | { template: string | TemplateRef<any> }): TemplateRef<any> | undefined {
    if (typeof tmp == 'string') return undefined;
    return this.getCellTemplate(tmp.template);
  }
  getHeaderCheckboxColor(): SimpleComponentColor {
    if (this.appearance() == TableAppearance.Strong) return SimpleComponentColor.CurrentColor;
    return this.color();
  }
  getCellTemplate(tmp?: string | TemplateRef<any>): TemplateRef<any> | undefined {
    //return undefined
    if (!tmp) return undefined;
    //return template, if it is one
    if (tmp instanceof TemplateRef) return tmp;
    //check if the name can be found
    if (!(tmp in this._itemTemplates)) {
      console.error(new Error(`<ard-table> error: cannot find template named "${tmp}"`)); //TODO
      return undefined;
    }
    //return the template
    return this._itemTemplates[tmp];
  }
  getCellStyle(cell: TableDataColumn | TableSubheader): string {
    if (isTableSubheader(cell)) return 'width:unset;min-width:unset';
    const width = typeof cell.width == 'number' ? `${cell.width}px` : cell.width;
    const minWidth = typeof cell.minWidth == 'number' ? `${cell.minWidth}px` : cell.minWidth;
    return [`width:${width ?? 'unset'}`, `min-width:${minWidth ?? 'unset'}`].join(';');
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
      if (unselected.length) this.unselectRowEvent.emit(unselected);
    } else {
      const [selected, failed] = this._itemStorage.selectItem(index);
      if (selected.length) this.selectRowEvent.emit(selected);
      if (failed.length) this.failedSelectRowEvent.emit(failed);
    }
    this._emitSelect();
  }
  /**
   * Toggles the selection state of all rows in the table.
   */
  toggleAllRowsSelected(): void {
    if (this._itemStorage.areAllSelected()) {
      const unselected = this._itemStorage.unselectAll();
      if (unselected.length) this.unselectRowEvent.emit(unselected);
    } else {
      const [selected, failed] = this._itemStorage.selectAll();
      if (selected.length) this.selectRowEvent.emit(selected);
      if (failed.length) this.failedSelectRowEvent.emit(failed);
    }
    this._emitSelect();
  }
  private _emitSelect(): void {
    const v = this._itemStorage.value();
    this.selectedRowsChangeEvent.emit(v);
  }
  isCellCheckbox(cell: any): boolean {
    return typeof cell == 'object' && '_ardCheckbox' in cell && 'index' in cell;
  }
  isHeaderCellCheckbox(cell: HeaderCell): boolean {
    const dataCell = cell.cell();
    if (isTableSubheader(dataCell)) return false;
    if (typeof dataCell.dataSource == 'string') return false;
    return dataCell.dataSource.type == 'checkbox';
  }
  isHeaderCellSortable(cell: HeaderCell): boolean {
    const dataCell = cell.cell();
    if (isTableSubheader(dataCell)) return false;
    return dataCell.sortable ?? false;
  }

  readonly selectedRowsChangeEvent = output<any[]>({ alias: 'selectedRowsChange' });
  readonly failedSelectRowEvent = output<any[]>({ alias: 'failedSelectRow' });
  readonly selectRowEvent = output<any[]>({ alias: 'selectRow' });
  readonly unselectRowEvent = output<any[]>({ alias: 'unselectRow' });

  //! contexts
  getHeaderContext(cell: TableDataColumn, index: number): TableHeaderContext | null;
  getHeaderContext(cell: TableSubheader, index: number): TableSubheaderContext | null;
  getHeaderContext(cell: TableDataColumn | TableSubheader, index: number): TableHeaderContext | TableSubheaderContext | null;
  getHeaderContext(cell: TableDataColumn | TableSubheader, index: number): TableHeaderContext | TableSubheaderContext | null {
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
      onTriggerSort: (event?: Event) => this._itemStorage.toggleCurrentSortColumn(index),
      onTriggerResetSort: (event?: Event) => {
        this._itemStorage.resetSort();
        event?.preventDefault();
        event?.stopPropagation();
      },
    };
  }
  readonly getHeaderCheckboxContext = computed<TableHeaderCheckboxContext>(() => {
    let state: CheckboxState = CheckboxState.Unselected;
    if (this._itemStorage.isAnyItemSelected()) {
      state = CheckboxState.Indeterminate;
      if (this._itemStorage.areAllSelected()) {
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
  });
  getCheckboxContext(index: number): TableCheckboxContext {
    const item = this._itemStorage.items().find(v => v.index() == index)!;
    const selected = item.selected();
    return {
      $implicit: selected,
      selected: selected,
      disabled: item.disabled(),
      onChange: () => {
        this.onCheckboxClick(index);
      },
    };
  }
}
