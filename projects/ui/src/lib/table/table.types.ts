import { TemplateRef } from "@angular/core";
import { ComponentColor } from "../types/colors.types";
import { NonEmptyArray } from "../types/utility.types";

export type DataSource = string | { type: 'checkbox' | 'autocount' };

export interface _GenericColumn {
    header: string | { template: string | TemplateRef<unknown>; };
    cellClass?: string;
}

export interface TableDataColumn extends _GenericColumn {
    dataSource: DataSource;
    template?: string | TemplateRef<unknown>;
    sortable?: boolean;
    highlight?: boolean | ComponentColor;
    width?: string | number;
    minWidth?: string | number;
}
export interface TableSubheader extends _GenericColumn {
    children: NonEmptyArray<TableSubheader | TableDataColumn>;
}

//! contexts
export interface TableCheckboxContext {
    $implicit: boolean;
    selected: boolean;
    onChange: () => void;
}