import { RoundedSelectionCell, RoundedSelectionState as RSS } from "./types";


export function getRoundedSelectionClasses(cellData: RoundedSelectionCell): string {
    return [
        cellData.top ? 'ard-rounded-selection-top' : '',
        cellData.left ? 'ard-rounded-selection-left' : '',
        cellData.right ? 'ard-rounded-selection-right' : '',
        cellData.bottom ? 'ard-rounded-selection-bottom' : '',
        getCornerClass(cellData.topLeft, 'top-left'),
        getCornerClass(cellData.topRight, 'top-right'),
        getCornerClass(cellData.bottomLeft, 'bottom-left'),
        getCornerClass(cellData.bottomRight, 'bottom-right'),
        cellData.top || cellData.left || cellData.right || cellData.bottom ? 'ard-rounded-selection-filled' : 'ard-rounded-selection-empty',
    ].join(' ');
}
function getCornerClass(value: RSS | undefined, corner: string): string {
    if (!value || value == RSS.None) return `ard-rounded-selection-${corner}-none`;
    if (value == RSS.HorizontalStraight) return `ard-rounded-selection-${corner}-horizontal`;
    if (value == RSS.VerticalStraight) return `ard-rounded-selection-${corner}-vertical`;
    if (value == RSS.Rounded) return `ard-rounded-selection-${corner}-rounded`;
    return `ard-rounded-selection-${corner}-negative`;
}