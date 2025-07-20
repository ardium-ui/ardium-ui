import { StarColor, StarFillMode } from "../star.types";


export interface ArdStarButtonStarTemplateContext {
  $implicit: StarFillMode;
  fillMode: StarFillMode;
  color: StarColor;
}
