import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    Input,
    AfterContentInit,
} from '@angular/core';
import { TableDataColumn } from '../table/table.types';
import { NonEmptyArray } from '../types/utility.types';

@Component({
    selector: 'ard-table-from-csv',
    templateUrl: './table-from-csv.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTableFromCsvComponent implements AfterContentInit {
    @Input() separator: string = ',';

    private _isDataOkay: boolean = false;
    @Input()
    set data(v: string) {
        this._isDataOkay = false;
        if (!this._isCsvValid(v)) return;
        const lines = v.split('\n');
        const headers = this._convertCsvToHeaders(lines.shift()!);
        const dataRows = this._convertCsvToArray(lines, headers);

        this._isDataOkay = true;
        this.headers = headers;
        this.dataRows = dataRows;
    }

    headers: TableDataColumn[] = [];
    dataRows: any[] = [];

    ngAfterContentInit(): void {
        if (!this._isDataOkay) {
            console.error(
                new Error(
                    '<ard-table-from-csv> error: must provide non-empty data',
                ),
            );
        }
    }

    private _isCsvValid(csv: string): boolean {
        return csv.length > 1;
    }
    private _convertCsvToHeaders(line: string): TableDataColumn[] {
        const headers = line.split(this.separator);
        return headers.map((header) => {
            header = header.trim();
            return {
                header,
                dataSource: header,
            };
        });
    }
    private _convertCsvToArray(
        lines: string[],
        headers: TableDataColumn[],
    ): any[] {
        const dataRows: { [key: string]: any }[] = [];

        for (const line of lines) {
            const lineArr = line.split(this.separator);

            const obj: { [key: string]: any } = {};
            for (let i = 0; i < headers.length; i++) {
                const source = headers[i].dataSource as string;
                obj[source] = lineArr[i]?.trim() ?? '';
            }
            dataRows.push(obj);
        }
        return dataRows;
    }
}
