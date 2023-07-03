import { Pipe, PipeTransform } from '@angular/core';
import { approximate } from 'more-rounding';

const filesizeMap = {
    k: 'kB',
    M: 'MB',
    B: 'GB',
    T: 'TB',
    Qa: 'PB',
    Qi: 'EB',
}

@Pipe({
    name: 'filesize'
})
export class ArdiumFilesizePipe implements PipeTransform {

    transform(value: number, precision: number = 2): string {
        return approximate(value, precision, undefined, undefined, filesizeMap);
    }
}
