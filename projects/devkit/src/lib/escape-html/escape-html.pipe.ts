import { Pipe, PipeTransform } from '@angular/core';

const UNESCAPED_HTML_REGEX = /[&<>"']/g;
const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;'
} as const;

@Pipe({
    name: 'escapeHTML'
})
export class ArdiumEscapeHTMLPipe implements PipeTransform {

    transform(value: string, ...args: any[]): string {
        if (!value || !UNESCAPED_HTML_REGEX.test(value)) return value;

        return value.replace(UNESCAPED_HTML_REGEX, chr => HTML_ESCAPES[chr as keyof typeof HTML_ESCAPES]);
    }
}
