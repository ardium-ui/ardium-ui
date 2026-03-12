import { StarColor, StarFillMode } from '../star.types';

export interface ArdStarButtonStarTemplateContext {
  $implicit: StarFillMode;
  fillMode: StarFillMode;
  fillModeInternal: StarFillMode;
  color: StarColor;
}
