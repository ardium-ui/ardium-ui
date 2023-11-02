

export function _sanitizeRegExpString(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}