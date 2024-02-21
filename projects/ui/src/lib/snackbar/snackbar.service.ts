import { Injectable, inject } from '@angular/core';
import { ArdSnackbarOptions, ArdSnackbarQueueHandling } from './snackbar.types';
import { ARD_SNACKBAR_DEFAULT_OPTIONS } from './snackbar.token';
import { ArdSnackbarRef, _ArdSnackbarRefInternal } from './snackbar-ref';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    private readonly _snackbarQueue = new Queue<_ArdSnackbarRefInternal>();

    private readonly _defaultOptions = inject(ARD_SNACKBAR_DEFAULT_OPTIONS);

    open(
        message: string,
        action: string,
        options: ArdSnackbarOptions = {}
    ): ArdSnackbarRef {
        if (options.placement) {
            options.placement.align ??= this._defaultOptions.placement!.align;
            options.placement.origin ??= this._defaultOptions.placement!.origin;
            options.placement.originRelation ??=
                this._defaultOptions.placement!.originRelation;
        } else {
            options.placement = this._defaultOptions.placement;
        }
        options.duration ??= this._defaultOptions.duration;
        options.queueHandling ??= this._defaultOptions.queueHandling;
        options.panelClass ??= this._defaultOptions.panelClass;

        const internalRef = new _ArdSnackbarRefInternal(
            message,
            action,
            options,
            (withAction?: boolean) => this.dismissCurrent(withAction)
        );
        if (options.queueHandling === ArdSnackbarQueueHandling.Default) {
            const wasEmpty = this._snackbarQueue.isEmpty();
            this._snackbarQueue.push(internalRef);
            if (wasEmpty) {
                this._openNext();
            }
        } else if (options.queueHandling === ArdSnackbarQueueHandling.Skip) {
            this._snackbarQueue.push(internalRef);
            this.dismissCurrent();
            this._openNext();
        } else if (options.queueHandling === ArdSnackbarQueueHandling.Overwrite) {
            this._snackbarQueue.clear();
            this._snackbarQueue.push(internalRef);
            this.dismissCurrent();
            this._openNext();
        }
        return internalRef.publicRef;
    }
    private _openNext() {} //TODO
    dismissCurrent(withAction?: boolean) {} //TODO
    clearQueue() {} //TODO
}
