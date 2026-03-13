import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { CurrentItemsFormatFn, PaginationAlign } from '../table-pagination/table-pagination.types';
import { TableDataColumn, TablePaginationStrategy } from '../table/table.types';
import { ComponentColor } from '../types/colors.types';
import { Nullable } from '../types/utility.types';
import { ARD_TABLE_FROM_CSV_DEFAULTS } from './table-from-csv.defaults';

@Component({
  standalone: false,
  selector: 'ard-table-from-csv',
  templateUrl: './table-from-csv.component.html',
  styleUrls: ['./table-from-csv.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTableFromCsvComponent implements AfterContentInit, OnChanges {
  protected readonly _DEFAULTS = inject(ARD_TABLE_FROM_CSV_DEFAULTS);

  // most inputs are of type "any" because <ard-table> accepts type "any" and coerces it into appropriate types
  readonly selectableRows = input<any>(this._DEFAULTS.selectableRows);
  readonly maxSelectedItems = input<any>(this._DEFAULTS.maxSelectedItems);
  readonly clickableRows = input<any>(this._DEFAULTS.clickableRows);

  readonly isLoading = input<any>(this._DEFAULTS.isLoading);
  readonly loadingProgress = input<any>(this._DEFAULTS.loadingProgress);

  readonly caption = input<Nullable<string>>(this._DEFAULTS.caption);

  readonly appearance = input<any>(this._DEFAULTS.appearance);
  readonly variant = input<any>(this._DEFAULTS.variant);
  readonly color = input<any>(this._DEFAULTS.color);
  readonly align = input<any>(this._DEFAULTS.align);
  readonly headerAlign = input<any>(this._DEFAULTS.headerAlign);

  readonly compact = input<any>(this._DEFAULTS.compact);
  readonly zebra = input<any>(this._DEFAULTS.zebra);
  readonly stickyHeader = input<any>(this._DEFAULTS.stickyHeader);

  //! pagination
  readonly paginated = input<any>(this._DEFAULTS.paginated);

  readonly paginationStrategy = input<TablePaginationStrategy>(this._DEFAULTS.paginationStrategy);

  readonly paginationOptions = input<number[] | { value: number; label: string }[]>(this._DEFAULTS.paginationOptions);
  readonly totalItems = input<any>(this._DEFAULTS.totalItems);
  readonly paginationColor = input<ComponentColor>(this._DEFAULTS.paginationColor);
  readonly paginationAlign = input<PaginationAlign>(this._DEFAULTS.paginationAlign);
  readonly itemsPerPageText = input<string>(this._DEFAULTS.itemsPerPageText);
  readonly currentItemsFormatFn = input<CurrentItemsFormatFn>(this._DEFAULTS.currentItemsFormatFn);

  readonly pageFillRemaining = input<any>(this._DEFAULTS.pageFillRemaining);
  readonly paginationDisabled = input<any>(this._DEFAULTS.paginationDisabled);
  readonly useFirstLastButtons = input<any>(this._DEFAULTS.useFirstLastButtons);

  readonly itemsPerPage = model<number>(this._DEFAULTS.itemsPerPage);
  readonly page = model<number>(this._DEFAULTS.page);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemsPerPage']) {
      const ipp = changes['itemsPerPage'].currentValue;
      const options =
        (changes['paginationOptions']?.currentValue as number[] | { value: number; label: string }[]) ||
        (this.paginationOptions() as number[] | { value: number; label: string }[]);
      if (!options.find(v => (typeof v === 'number' ? v === ipp : v.value === ipp))) {
        console.error(
          new Error(
            `ARD-NF5071: value of "${ipp}" in <ard-table-from-csv>'s [itemsPerPage] does not appear in [paginationOptions] array [${options
              .map(v => (typeof v === 'number' ? v : v.value))
              .join(', ')}]`
          )
        );
      }
    }
    if (changes['paginationOptions']) {
      const options = changes['paginationOptions'].currentValue.map((v: number | { value: number; label: string }) =>
        typeof v === 'number' ? v : v.value
      ) as number[];
      for (const opt of options) {
        if (opt <= 0 || opt % 1 !== 0) {
          console.error(
            new Error(
              `ARD-NF5072: each item of <ard-table-from-csv>'s [paginationOptions] must be a positive integer. The "${opt}" option will be ignored.`
            )
          );
        }
      }
    }
    if (changes['page']) {
      const page = changes['page'].currentValue as number;
      if (page === 0) {
        throw new Error(
          `ARD-FT5073a: <ard-table-from-csv>'s [page] uses 1-indexed numbering system. The value 0 is not accepted.`
        );
      } else if (page < 0 || page % 1 !== 0) {
        throw new Error(`ARD-FT5073b: value of <ard-table-from-csv>'s [page] must be a positive integer, got "${page}".`);
      }
    }
  }

  //! data
  readonly separator = input<string>(this._DEFAULTS.separator);

  readonly stringData = input<string>('', { alias: 'data' });
  readonly data = computed<{ headers: TableDataColumn[]; dataRows: any[] } | null>(() => {
    const v = this.stringData();
    if (!this._isCsvValid(v)) return null;
    const lines = v.split('\n');
    const headers = this._convertCsvToHeaders(lines.shift()!);
    const dataRows = this._convertCsvToArray(lines, headers);
    return { headers, dataRows };
  });

  private readonly _isDataOkay = computed(() => this.data() !== null);

  readonly headers = computed(() => this.data()?.headers ?? []);
  readonly dataRows = computed(() => this.data()?.dataRows ?? []);

  ngAfterContentInit(): void {
    if (!this._isDataOkay()) {
      console.error(new Error(`ARD-FT5070: Expected <ard-table-from-csv>'s [data] attribute to be a non-empty string, got "".`));
    }
  }

  private _isCsvValid(csv: string): boolean {
    return csv.length > 1;
  }
  private _convertCsvToHeaders(line: string): TableDataColumn[] {
    const headers = line.split(this.separator());
    return headers.map(header => {
      header = header.trim();
      return {
        header,
        dataSource: header,
      };
    });
  }
  private _convertCsvToArray(lines: string[], headers: TableDataColumn[]): any[] {
    const dataRows: Record<string, any>[] = [];

    for (const line of lines) {
      const lineArr = line.split(this.separator());

      const obj: Record<string, any> = {};
      for (let i = 0; i < headers.length; i++) {
        const source = headers[i].dataSource as string;
        obj[source] = lineArr[i]?.trim() ?? '';
      }
      dataRows.push(obj);
    }
    return dataRows;
  }
}
