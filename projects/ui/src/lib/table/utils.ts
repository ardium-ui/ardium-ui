import { TableDataColumn, TableSubheader } from "./table.types";


export function isTableSubheader(v: TableDataColumn | TableSubheader): v is TableSubheader {
    return 'children' in v;
}

export function areAllDataColumns(cols: (TableDataColumn | TableSubheader)[]): boolean {
    return cols.every(col => !isTableSubheader(col));
}

export function merge2dArrays<T>(destArr: T[][], arr: T[][]): void {
    const diff = arr.length - destArr.length;
    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            destArr.push([]);
        }
    }
    for (let row = 0; row < arr.length; row++) {
        destArr[row] = [...destArr[row], ...arr[row]];
    }
}