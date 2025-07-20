import { StarColor, StarFillMode } from "../star.types";


export interface ArdStarDisplayStarTemplateContext {
  $implicit: StarFillMode;
  fillMode: StarFillMode;
  index: number;
  valueIndex: number;
  color: StarColor;
}
