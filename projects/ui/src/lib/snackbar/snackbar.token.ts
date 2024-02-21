import { InjectionToken } from '@angular/core';
import {
    ArdSnackbarAlignment,
    ArdSnackbarOptions,
    ArdSnackbarOriginRelation,
    ArdSnackbarQueueHandling,
} from './snackbar.types';

export const ARD_SNACKBAR_DEFAULT_OPTIONS =
    new InjectionToken<ArdSnackbarOptions>('ard-snackbar-default-options', {
        factory: () => ({
            placement: {
                align: ArdSnackbarAlignment.BottomCenter,
                origin: document.body,
                originRelation: ArdSnackbarOriginRelation.Inside,
            },
            duration: 5000,
            queueHandling: ArdSnackbarQueueHandling.Default,
            panelClass: undefined,
        }),
    });
