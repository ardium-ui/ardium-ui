
/**
 * The color of the component.
 * 
 * @see {@link ButtonColoringMode} to set what part of the component should be colored.
 */
export const ComponentColor = {
    /**
     * The app's standard text color.
     */
    None: 'none',
    /**
     * The app's primary color.
     */
    Primary: 'primary',
    /**
     * The app's secondary color.
     */
    Secondary: 'secondary',
    /**
     * The app's warning color. Usually some shade of yellow.
     */
    Warning: 'warn',
    /**
     * The app's danger color. Usually some shade of red.
     */
    Danger: 'danger',
    /**
     * The app's success color. Usually some shade of green or lime.
     */
    Success: 'success',
    /**
     * The app's info color. Usually some shade of blue or light blue.
     */
    Info: 'info',
} as const;
export type ComponentColor = typeof ComponentColor[keyof typeof ComponentColor];

export const SimpleComponentColor = {
    ...ComponentColor,
    /**
     * The current color set by css.
     */
    CurrentColor: 'currentColor',
} as const;
export type SimpleComponentColor = typeof SimpleComponentColor[keyof typeof SimpleComponentColor];