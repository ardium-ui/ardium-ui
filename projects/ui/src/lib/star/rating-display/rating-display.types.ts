import { StarColor, StarFillMode } from '../star.types';

export interface ArdRatingDisplayStarTemplateContext {
  $implicit: StarFillMode;
  fillMode: StarFillMode;
  index: number;
  valueIndex: number;
  color: StarColor;
}
