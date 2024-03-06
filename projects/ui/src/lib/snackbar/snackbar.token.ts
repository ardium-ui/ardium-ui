import { InjectionToken } from '@angular/core';
import {
    ArdSnackbarAlignment,
    ArdSnackbarOptions,
    ArdSnackbarOriginRelation,
    ArdSnackbarQueueHandling,
} from './snackbar.types';

export const ARD_SNACKBAR_DEFAULT_OPTIONS = new InjectionToken<
    Required<ArdSnackbarOptions>
>('ard-snackbar-default-options', {
    factory: () =>
        ({
            placement: {
                align: ArdSnackbarAlignment.BottomCenter,
                origin: document.body,
                originRelation: ArdSnackbarOriginRelation.Inside,
            },
            duration: 5000,
            queueHandling: ArdSnackbarQueueHandling.Default,
            panelClass: [],
        } as unknown as Required<ArdSnackbarOptions>),
});

export const ARD_SNACKBAR_ANIMATION_LENGTH = new InjectionToken<number>(
    'ard-snackbar-animation-length',
    {
        factory: () => 150,
    }
);
