import { RoundedSelectionCell, RoundedSelectionState as RSS } from "./types";


export function getRoundedSelectionHTMLData(cellData: RoundedSelectionCell): { classes: string, span: number } {
    return {
        span: cellData.span,
        classes: [
            'ard-rounded-selection-cell',
            getCornerClass(cellData.topLeft, 'top-left'),
            getCornerClass(cellData.topRight, 'top-right'),
            getCornerClass(cellData.bottomLeft, 'bottom-left'),
            getCornerClass(cellData.bottomRight, 'bottom-right'),
            cellData.filled ? 'ard-rounded-selection-filled' : 'ard-rounded-selection-empty',
        ].join(' '),
    };
}
function getCornerClass(value: RSS | undefined, corner: string): string {
    if (value == RSS.Negative) return `ard-rounded-selection-negative ard-rounded-selection-${corner}-negative`;
    if (value == RSS.Rounded) return `ard-rounded-selection-${corner}-rounded`;
    return `ard-rounded-selection-${corner}-none`;
}