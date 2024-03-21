import { ComponentRef, ElementRef } from '@angular/core';
import { ComponentColor } from '../types/colors.types';

export const ArdSnackbarAlignment = {
    TopLeft: 'top-left',
    TopCenter: 'top-center',
    TopRight: 'top-right',
    BottomLeft: 'bottom-left',
    BottomCenter: 'bottom-center',
    BottomRight: 'bottom-right',
} as const;
export type ArdSnackbarAlignment =
    (typeof ArdSnackbarAlignment)[keyof typeof ArdSnackbarAlignment];

export const ArdSnackbarOriginRelation = {
    Inside: 'inside',
    Outside: 'outside',
} as const;
export type ArdSnackbarOriginRelation =
    (typeof ArdSnackbarOriginRelation)[keyof typeof ArdSnackbarOriginRelation];

export const ArdSnackbarQueueHandling = {
    Default: 'default',
    Skip: 'skip',
    Overwrite: 'overwrite',
} as const;
export type ArdSnackbarQueueHandling = typeof ArdSnackbarQueueHandling[keyof typeof ArdSnackbarQueueHandling];

export type ArdSnackbarOrigin<T = any> =
    | HTMLElement
    | ElementRef<T>
    | ComponentRef<T>;

export const ArdSnackbarType = {
    None: 'none',
    Danger: 'danger',
    Warning: 'warn',
    Success: 'success',
    Info: 'info',
} as const;
export type ArdSnackbarType = typeof ArdSnackbarType[keyof typeof ArdSnackbarType];

export type ArdSnackbarData = { message: string; action?: string; };

export type ArdSnackbarOptions = {
    data?: ArdSnackbarData;
    placement?: {
        align?: ArdSnackbarAlignment;
        origin?: ArdSnackbarOrigin;
        originRelation?: ArdSnackbarOriginRelation;
    };
    duration?: number;
    color?: ComponentColor;
    type?: ArdSnackbarType;
    queueHandling?: ArdSnackbarQueueHandling;
    panelClass?: string | string[];
};