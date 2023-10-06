import { TemplateRef } from "@angular/core";
import { ComponentColor } from "../types/colors.types";
import { NonEmptyArray } from "../types/utility.types";
import { CheckboxState } from "../checkbox/checkbox.types";

export type DataSource = string | { type: 'checkbox' | 'autocount' };

export interface _GenericColumn {
    header: string | { template: string | TemplateRef<unknown>; };
    cellClass?: string;
}

export interface TableDataColumn extends _GenericColumn {
    dataSource: DataSource;
    template?: string | TemplateRef<unknown>;
    sortable?: boolean;
    sortFn?: (colData: any[]) => any[];
    highlight?: boolean | ComponentColor;
    width?: string | number;
    minWidth?: string | number;
    isRowHeader?: boolean;
}
export interface TableSubheader extends _GenericColumn {
    children: NonEmptyArray<TableSubheader | TableDataColumn>;
}

export const SortType = {
    Ascending: 'ascending',
    Descending: 'descending',
} as const;
export type SortType = typeof SortType[keyof typeof SortType];

//! contexts
export interface TableHeaderContext {
    $implicit: string;
    header: string;
    sortable: boolean;
    sortType: SortType | null;
    onClickSort: (event?: MouseEvent) => void;
}
export interface TableCheckboxContext {
    $implicit: boolean;
    selected: boolean;
    disabled: boolean;
    onChange: (event: MouseEvent) => void;
}
export interface TableHeaderCheckboxContext {
    $implicit: CheckboxState;
    state: CheckboxState;
    onChange: () => void;
}
export interface TableCaptionContext {
    $implicit: string;
}

//! appearance-related
export const TableAppearance = {
    Strong: 'strong',
    Light: 'light',
    Colorless: 'colorless',
} as const;
export type TableAppearance = typeof TableAppearance[keyof typeof TableAppearance];

export const TableVariant = {
    Rounded: 'rounded',
    Sharp: 'sharp',
} as const;
export type TableVariant = typeof TableVariant[keyof typeof TableVariant];

export const TablePaginationStrategy = {
    Noop: 'noop',
    Slice: 'slice',
} as const;
export type TablePaginationStrategy = typeof TablePaginationStrategy[keyof typeof TablePaginationStrategy];

export const TableAlignType = {
    TopLeft: 'top-left',
    TopCenter: 'top-center',
    TopRight: 'top-right',
    CenterLeft: 'center-left',
    Center: 'center-center',
    CenterRight: 'center-right',
    BottomLeft: 'bottom-left',
    BottomCenter: 'bottom-center',
    BottomRight: 'bottom-right',
} as const;
export type TableAlignType = typeof TableAlignType[keyof typeof TableAlignType];