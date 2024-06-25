import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  computed,
  input,
  model,
} from '@angular/core';
import { TableDataColumn, TablePaginationStrategy } from '../table/table.types';
import { Nullable } from '../types/utility.types';
import { ComponentColor } from '../types/colors.types';
import { CurrentItemsFormatFn, PaginationAlign } from '../table-pagination/table-pagination.types';

@Component({
  selector: 'ard-table-from-csv',
  templateUrl: './table-from-csv.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTableFromCsvComponent implements AfterContentInit, OnChanges {
  readonly selectableRows = input<any>();
  readonly maxSelectedItems = input<any>();
  readonly clickableRows = input<any>();

  readonly isLoading = input<any>();
  readonly loadingProgress = input<any>();

  readonly caption = input<Nullable<string>>(undefined);

  readonly appearance = input<any>();
  readonly variant = input<any>();
  readonly color = input<any>();
  readonly align = input<any>();
  readonly headerAlign = input<any>();

  readonly compact = input<any>();
  readonly zebra = input<any>();
  readonly stickyHeader = input<any>();

  //! pagination
  readonly paginated = input<any>();

  readonly paginationStrategy = input<TablePaginationStrategy>(TablePaginationStrategy.Slice);

  readonly paginationOptions = input<number[] | { value: number; label: string }[]>([10, 25, 50]);
  readonly totalItems = input<any>();
  readonly paginationColor = input<ComponentColor>(ComponentColor.None);
  readonly paginationAlign = input<PaginationAlign>(PaginationAlign.Split);
  readonly itemsPerPageText = input<string>('Items per page:');
  readonly currentItemsFormatFn = input<CurrentItemsFormatFn>(
    ({ currentItemsFirst, currentItemsLast, totalItems }) => `${currentItemsFirst} – ${currentItemsLast} of ${totalItems}`
  );

  readonly pageFillRemaining = input<any>();
  readonly paginationDisabled = input<any>();
  readonly useFirstLastButtons = input<any>();

  readonly itemsPerPage = model<number>(50);
  readonly page = model<number>(1);

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
              `ARD-NF5072: each item of <ard-table-from-csv>'s [paginationOptions] must be a positive integer. The "${opt}" option will be ignored.` //TODO implement
            )
          );
        }
      }
    }
    if (changes['page']) {
      const page = changes['page'].currentValue as number;
      if (page === 0) {
        throw new Error(`ARD-FT5073a: <ard-table-from-csv>'s [page] uses 1-indexed numbering system. The value 0 is not accepted.`);
      } else if (page < 0 || page % 1 !== 0) {
        throw new Error(`ARD-FT5073b: value of <ard-table-from-csv>'s [page] must be a positive integer, got "${page}".`);
      }
    }
  }

  //! data
  readonly separator = input<string>(',');

  readonly data = input<{ headers: TableDataColumn[]; dataRows: any[] } | null, string>(null, {
    transform: v => {
      if (!this._isCsvValid(v)) return null;
      const lines = v.split('\n');
      const headers = this._convertCsvToHeaders(lines.shift()!);
      const dataRows = this._convertCsvToArray(lines, headers);
      return { headers, dataRows };
    },
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
