import { StarColor } from "../star.types";


export interface ArdStarInputStarButtonTemplateContext {
  color: StarColor;
  index: number;
  highlightedIndex: number;
  valueIndex: number;
  tabIndex: number;
  onClick: () => void;
  onFocus: (event: FocusEvent) => void;
  onBlur: (event: FocusEvent) => void;
  onHighlight: () => void;
}
