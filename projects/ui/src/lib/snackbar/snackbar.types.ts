import { ElementRef } from '@angular/core';
import { ComponentColor } from '../types/colors.types';

export const ArdSnackbarAlignment = {
  TopLeft: 'top-left',
  TopCenter: 'top-center',
  TopRight: 'top-right',
  BottomLeft: 'bottom-left',
  BottomCenter: 'bottom-center',
  BottomRight: 'bottom-right',
} as const;
export type ArdSnackbarAlignment = (typeof ArdSnackbarAlignment)[keyof typeof ArdSnackbarAlignment];

export const ArdSnackbarOriginRelation = {
  Inside: 'inside',
  Outside: 'outside',
} as const;
export type ArdSnackbarOriginRelation = (typeof ArdSnackbarOriginRelation)[keyof typeof ArdSnackbarOriginRelation];

export const ArdSnackbarQueueHandling = {
  Default: 'default',
  Skip: 'skip',
  Overwrite: 'overwrite',
} as const;
export type ArdSnackbarQueueHandling = (typeof ArdSnackbarQueueHandling)[keyof typeof ArdSnackbarQueueHandling];

export type ArdSnackbarOrigin<T = any> = HTMLElement | ElementRef<T>;

export const ArdSnackbarType = {
  None: 'none',
  Danger: 'danger',
  Warning: 'warn',
  Success: 'success',
  Info: 'info',
} as const;
export type ArdSnackbarType = (typeof ArdSnackbarType)[keyof typeof ArdSnackbarType];

export interface ArdSnackbarData {
  message: string;
  action?: string;
}

/**
 * Options for configuring the behavior and appearance of a snackbar.
 */
export interface ArdSnackbarOptions {
  /**
   * Message and action text data to be passed to the snackbar component
   */
  data?: ArdSnackbarData;
  /**
   * Placement options for the snackbar. If not provided, the snackbar will be centered at the bottom of the screen.
   */
  placement?: {
    /**
     * The alignment of the snackbar in relation to the origin element. If not provided, it will default to 'bottom-center'.
     */
    align?: ArdSnackbarAlignment;
    /**
     * The origin element to which the snackbar is attached. If not provided, it will default to 'document.body'.
     */
    origin?: ArdSnackbarOrigin;
    /**
     * The relation of the snackbar to the origin element. If not provided, it will default to 'outside'.
     */
    originRelation?: ArdSnackbarOriginRelation;
  };
  /**
   * Duration in milliseconds for which the snackbar should be visible. If not provided, it will default to 3000ms. Set to `Infinity` for a persistent snackbar that must be dismissed manually.
   */
  duration?: number;
  /**
   * Color of the snackbar. This will apply a corresponding color class to the snackbar element, which can be used to style the snackbar based on the chosen color. If not provided, it will default to 'primary'.
   */
  color?: ComponentColor;
  /**
   * Type of the snackbar, which can be used to apply specific styles or icons based on the type. If not provided, it will default to 'none'.
   */
  type?: ArdSnackbarType;
  /**
   * Defines how the snackbar should behave when there are multiple snackbars in the queue. If not provided, it will default to 'default'.
   * - 'default': New snackbars will be added to the end of the queue and displayed after the currently opened snackbar is dismissed.
   * - 'skip': The new snackbar will be added to the start of the queue and displayed after the current snackbar is dismissed.
   * - 'overwrite': If there is already an opened snackbar, it will be immediately dismissed and replaced with the new snackbar.
   */
  queueHandling?: ArdSnackbarQueueHandling;
  /**
   * Additional CSS class or classes to apply to the snackbar panel.
   */
  panelClass?: string | string[];
}
