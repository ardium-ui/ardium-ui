import { StarColor, StarFillMode } from "../star.types";


export interface ArdStarDisplayStarTemplateContext {
  $implicit: StarFillMode;
  fillMode: StarFillMode;
  color: StarColor;
  index: number;
}
