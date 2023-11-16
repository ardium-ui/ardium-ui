
import { ElementRef, QueryList } from '@angular/core';

export type DigitInputConfigData = {
    type: DigitInputConfigDataType;
    char?: string;
    index?: number;
    readonly?: boolean;
}
export interface DigitInputModelHost {
    inputs: QueryList<ElementRef<HTMLInputElement>>;
    configArrayData: DigitInputConfigData[];
}

export const DigitInputConfigDataType = {
    Input: 'input',
    Static: 'static',
} as const;
export type DigitInputConfigDataType = typeof DigitInputConfigDataType[keyof typeof DigitInputConfigDataType];


export function _sanitizeRegExpString(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}