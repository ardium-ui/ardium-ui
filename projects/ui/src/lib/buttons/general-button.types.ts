/**
 * General button appearance. Controls which parts of the button can be colored.
 *
 * @see {@link ButtonColoringMode}
 */
export const ButtonAppearance = {
  /**
   * No border and no background. Text and icon are colored.
   */
  Transparent: 'transparent',
  /**
   * No border, but with text shadow. Text, icon, and background are colored.
   */
  Raised: 'raised',
  /**
   * No border, but with text shadow. White background. Text and icon are colored.
   */
  RaisedStrong: 'raised-strong',
  /**
   * White background. Text and icon are colored.
   */
  Outlined: 'outlined',
  /**
   * White background. Text, icon, and border may be colored.
   *
   * Background becomes colored on hover/focus.
   */
  OutlinedStrong: 'outlined-strong',
  /**
   * No border. Text, icon, and background are colored.
   */
  Flat: 'flat',
} as const;
export type ButtonAppearance = (typeof ButtonAppearance)[keyof typeof ButtonAppearance];

export const ButtonVariant = {
  /**
   * Basic, rectangular button.
   */
  Rounded: 'rounded',
  /**
   * Pill-shaped button.
   */
  Pill: 'pill',
  /**
   * Basic, rectangular button with sharp corners.
   */
  Sharp: 'sharp',
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

/**
 * **F**loating **A**ction **B**utton size.
 */
export const FABSize = {
  Standard: 'standard',
  Small: 'small',
} as const;
export type FABSize = (typeof FABSize)[keyof typeof FABSize];
