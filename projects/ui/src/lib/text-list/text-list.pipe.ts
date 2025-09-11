import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: false, name: 'ardTextList', pure: true })
export class ArdiumTextListPipe implements PipeTransform {
  transform(value: any[], separator: string = ', ', filter: boolean = false): string {
    if (filter) return value.filter(Boolean).join(separator);
    return value.join(separator);
  }
}
