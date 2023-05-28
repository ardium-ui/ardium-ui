

//! input data types
export type SelectionLineData = {
    length: number;
    start: number;
    end: number;
} | {
    length: number;
    start?: number;
    end?: number;
};

export type SelectionData = SelectionLineData[];

//! output data types
export const RoundedSelectionState = {
    None: 'none',
    HorizontalStraight: 'horiz-straight',
    VerticalStraight: 'vert-straight',
    Rounded: 'rounded',
    Negative: 'negative',
} as const;
export type RoundedSelectionState = typeof RoundedSelectionState[keyof typeof RoundedSelectionState];

export type RoundedSelectionCell = {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    topLeft?: RoundedSelectionState;
    topRight?: RoundedSelectionState;
    bottomLeft?: RoundedSelectionState;
    bottomRight?: RoundedSelectionState;
}

export type RoundedSelectionLine = [] | RoundedSelectionCell[];

export type RoundedSelectionData = RoundedSelectionLine[];