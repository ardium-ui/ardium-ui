import { Pipe, PipeTransform } from '@angular/core';
import { keyToString } from 'key-display-names';

@Pipe({
    name: 'kbd',
})
export class ArdiumKbdPipe implements PipeTransform {
    transform(value: string, useShort?: boolean): string {
        return keyToString(value, useShort);
    }
}
