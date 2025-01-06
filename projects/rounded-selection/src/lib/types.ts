//! input data types
export type SelectionLineData =
  | {
      length: number;
      start: number;
      end: number;
    }
  | {
      length: number;
      start?: number;
      end?: number;
    };

export type SelectionData = SelectionLineData[];

//! output data types
export const RoundedSelectionState = {
  None: 'none',
  Rounded: 'rounded',
  Negative: 'negative',
} as const;
export type RoundedSelectionState = (typeof RoundedSelectionState)[keyof typeof RoundedSelectionState];

export interface RoundedSelectionCell {
  span: number;
  filled: boolean;
  topLeft?: RoundedSelectionState;
  topRight?: RoundedSelectionState;
  bottomLeft?: RoundedSelectionState;
  bottomRight?: RoundedSelectionState;
}

export type RoundedSelectionLine = [] | RoundedSelectionCell[];

export type RoundedSelectionData = RoundedSelectionLine[];
