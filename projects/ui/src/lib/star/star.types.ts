import { SimpleComponentColor } from '../types/colors.types';

export const StarFillMode = {
  /**
   * The star is not filled, just an outline.
   */
  None: 'none',
  /**
   * Half of the star is filled.
   */
  Half: 'half',
  /**
   * The star is fully filled.
   */
  Filled: 'filled',
} as const;
export type StarFillMode = (typeof StarFillMode)[keyof typeof StarFillMode];

export const StarColor = {
  ...SimpleComponentColor,
  /**
   * THe app's color set for all stars. Usually gold or yellow-gold.
   */
  Star: 'star',
} as const;
export type StarColor = (typeof StarColor)[keyof typeof StarColor];
