import { ComponentRef, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

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

export type ArdSnackbarOptions = {
    placement?: {
        align?: ArdSnackbarAlignment;
        origin?: ArdSnackbarOrigin;
        originRelation?: ArdSnackbarOriginRelation;
    };
    duration?: number;
    queueHandling?: ArdSnackbarQueueHandling;
    panelClass?: string | string[];
};