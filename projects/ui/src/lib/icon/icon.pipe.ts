import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'icon',
})
export class ArdiumIconPipe implements PipeTransform {
  transform(value: string): string {
    value = value.trim().toLowerCase();
    value = value.replace(/[ -]/g, '_');
    return value;
  }
}
