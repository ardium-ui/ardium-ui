import { inject, Pipe, PipeTransform } from '@angular/core';
import { keyToString } from 'key-display-names';
import { ARD_KBD_DEFAULTS } from './kbd.defaults';

@Pipe({
  standalone: false,
  name: 'kbd',
})
export class ArdiumKbdPipe implements PipeTransform {
  protected readonly _DEFAULTS = inject(ARD_KBD_DEFAULTS);

  transform(value: string, useShort: boolean = !this._DEFAULTS.full): string {
    return keyToString(value, useShort);
  }
}
