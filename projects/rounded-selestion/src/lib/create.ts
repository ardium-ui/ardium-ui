import { RoundedSelectionCell, RoundedSelectionData, RoundedSelectionLine, RoundedSelectionState as RSS, SelectionData, SelectionLineData } from "./types";
import { isDefined } from 'simple-bool';


export function createRoundedLines(selection: SelectionData): RoundedSelectionData {
    const roundedSelection: RoundedSelectionData = [];

    //process each line
    for (let i = 0; i < selection.length; i++) {
        const line = selection[i];
        const prevLine = selection[i - 1];
        const nextLine = selection[i + 1];

        const lineResult = getLineObjects(line, prevLine, nextLine);
        roundedSelection.push(lineResult);
    }

    return roundedSelection;
}

function getLineObjects(line: SelectionLineData, prevLine?: SelectionLineData, nextLine?: SelectionLineData): RoundedSelectionLine {
    if (!isFilledLine(line)) return [];

    const lineData: RoundedSelectionCell[] = [];

    const { length, start, end } = line;

    //* check for errors
    if (start < 0 || end < 0) {
        throw new Error(`Selection start and end values cannot be negative. The faulty line object: ${JSON.stringify(line, null, 4)}`);
    }
    if (start > end) {
        throw new Error(`Selection start index cannot be greater than the end index. The faulty line object: ${JSON.stringify(line, null, 4)}`);
    }
    if (end > length - 1) {
        throw new Error(`Selection end index cannot be greater than the line length. The faulty line object: ${JSON.stringify(line, null, 4)}`);
    }

    //* add before
    lineData.push(...getBeforeStartSelection(line, prevLine, nextLine));

    //* add main
    if (start == end) {
        lineData.push(...getOneWideSelection(line, prevLine, nextLine));
    }
    else {
        lineData.push(...getStandardSelectionBody(line, prevLine, nextLine));
    }

    //* add after
    lineData.push(...getAfterEndSelection(line, prevLine, nextLine));

    return lineData;
}

function getBeforeStartSelection(line: { length: number; start: number; end: number; }, prevLine?: SelectionLineData, nextLine?: SelectionLineData): RoundedSelectionLine {
    const lineData: RoundedSelectionCell[] = [];

    const { start } = line;

    const isBeforeStartPrev = prevLine && isSelectionAt(start - 1, prevLine);
    const isBeforeStartNext = nextLine && isSelectionAt(start - 1, nextLine);
    const isAtStartPrev = prevLine && isSelectionAt(start, prevLine);
    const isAtStartNext = nextLine && isSelectionAt(start, nextLine);
    //* add before
    const beforeStart = start - 1;
    for (let i = 0; i < beforeStart; i++) {
        lineData.push({ filled: false });
    }
    //* add immediately before
    if (isBeforeStartPrev && isAtStartPrev || isBeforeStartNext && isAtStartNext) {
        lineData.push({
            filled: false,
            topRight: isBeforeStartPrev && isAtStartPrev ? RSS.Negative : RSS.None,
            bottomRight: isBeforeStartNext && isAtStartNext ? RSS.Negative : RSS.None,
        });
    }
    else if (start != 0) {
        lineData.push({ filled: false });
    }

    return lineData;
}
function getAfterEndSelection(line: { length: number; start: number; end: number; }, prevLine?: SelectionLineData, nextLine?: SelectionLineData): RoundedSelectionLine {
    const lineData: RoundedSelectionCell[] = [];

    const { length, start } = line;

    const isAtStartPrev = prevLine && isSelectionAt(start, prevLine);
    const isAtStartNext = nextLine && isSelectionAt(start, nextLine);
    const isAfterStartPrev = prevLine && isSelectionAt(start + 1, prevLine);
    const isAfterStartNext = nextLine && isSelectionAt(start + 1, nextLine);

    //* add immediately after
    if (isAfterStartPrev && isAtStartPrev || isAfterStartNext && isAtStartNext) {
        lineData.push({
            filled: false,
            topLeft: isAfterStartPrev && isAtStartPrev ? RSS.Negative : RSS.None,
            bottomLeft: isAfterStartNext && isAtStartNext ? RSS.Negative : RSS.None,
        });
    }
    else if (start != length - 1) {
        lineData.push({ filled: false });
    }
    //* add after
    for (let i = start + 1; i < length; i++) {
        lineData.push({ filled: false });
    }

    return lineData;
}

function getOneWideSelection(line: { length: number; start: number; end: number; }, prevLine?: SelectionLineData, nextLine?: SelectionLineData): RoundedSelectionLine {
    const lineData: RoundedSelectionCell[] = [];

    const { start } = line;

    const isBeforeStartPrev = prevLine && isSelectionAt(start - 1, prevLine);
    const isBeforeStartNext = nextLine && isSelectionAt(start - 1, nextLine);
    const isAtStartPrev = prevLine && isSelectionAt(start, prevLine);
    const isAtStartNext = nextLine && isSelectionAt(start, nextLine);
    const isAfterStartPrev = prevLine && isSelectionAt(start + 1, prevLine);
    const isAfterStartNext = nextLine && isSelectionAt(start + 1, nextLine);

    //* add main
    //determine top left
    let topLeft: RSS = isBeforeStartPrev && isAtStartPrev ? RSS.None : RSS.Rounded;
    //determine bottom left
    let bottomLeft: RSS = isBeforeStartNext && isAtStartNext ? RSS.None : RSS.Rounded;
    //determine top right
    let topRight: RSS = isAfterStartPrev && isAtStartPrev ? RSS.None : RSS.Rounded;
    //determine bottom right
    let bottomRight: RSS = isAfterStartNext && isAtStartNext ? RSS.None : RSS.Rounded;

    lineData.push({
        filled: true,
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
    });

    return lineData;
}
function getStandardSelectionBody(line: { length: number; start: number; end: number; }, prevLine?: SelectionLineData, nextLine?: SelectionLineData): RoundedSelectionLine {
    const lineData: RoundedSelectionCell[] = [];

    const { start, end } = line;

    //* add start
    {
        const isBeforeStartPrev = prevLine && isSelectionAt(start - 1, prevLine);
        const isBeforeStartNext = nextLine && isSelectionAt(start - 1, nextLine);
        const isAtStartPrev = prevLine && isSelectionAt(start, prevLine);
        const isAtStartNext = nextLine && isSelectionAt(start, nextLine);

        //determine top left
        let topLeft: RSS = isBeforeStartPrev || isAtStartPrev ? RSS.None : RSS.Rounded;
        //determine bottom left
        let bottomLeft: RSS = isBeforeStartNext || isAtStartNext ? RSS.None : RSS.Rounded;

        lineData.push({
            filled: true,
            topLeft,
            bottomLeft,
            topRight: RSS.None,
            bottomRight: RSS.None,
        });
    }

    //* add middle
    for (let i = start + 1; i < end - 1; i++) {
        lineData.push({
            filled: true,
        });
    }

    //* add end
    {
        const isAtEndPrev = prevLine && isSelectionAt(end, prevLine);
        const isAtEndNext = nextLine && isSelectionAt(end, nextLine);
        const isAfterEndPrev = prevLine && isSelectionAt(end + 1, prevLine);
        const isAfterEndNext = nextLine && isSelectionAt(end + 1, nextLine);

        //determine top right
        let topRight: RSS = isAfterEndPrev || isAtEndPrev ? RSS.None : RSS.Rounded;
        //determine bottom right
        let bottomRight: RSS = isAfterEndNext || isAtEndNext ? RSS.None : RSS.Rounded;

        lineData.push({
            filled: true,
            topRight,
            bottomRight,
            topLeft: RSS.None,
            bottomLeft: RSS.None,
        });
    }

    return lineData;
}

function isFilledLine(line: SelectionLineData): line is { length: number; start: number; end: number; } {
    return isDefined(line.start) || isDefined(line.end);
}

function isSelectionAt(pos: number, line: SelectionLineData): boolean {
    if (!isFilledLine(line)) return false; //return false for lines without selection
    if (pos < 0) return false; //return false for negative positions
    if (pos >= line.length) return false; //return false for outside of line length

    //pos has to be withing the bounds of the selection (inclusive)
    return pos >= line.start && pos <= line.end;
}