import { Component, inject } from '@angular/core';
import { ArdSnackbarQueueHandling, ArdSnackbarRef, ArdSnackbarType, ArdiumSnackbarService } from '@ardium-ui/ui';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.page.html',
    styleUrl: './snackbar.page.scss',
})
export class SnackbarPage {
    private readonly _snackbarService = inject(ArdiumSnackbarService);

    openSnackbar1() {
        this._snackbarService.open('Hello world!');
    }
    openSnackbar2() {
        this._snackbarService.open('Hello world!', 'Dismiss');
    }
    openSnackbar3(type: ArdSnackbarType) {
        this._snackbarService.open('Hello world!', 'Dismiss', { type, queueHandling: ArdSnackbarQueueHandling.Overwrite });
    }

    private _ref4?: ArdSnackbarRef;
    openSnackbar4() {
        this._ref4 = this._snackbarService.open('Hello world!', 'Dismiss', { duration: Infinity, queueHandling: ArdSnackbarQueueHandling.Overwrite });
    }
    closeSnackbar4() {
        this._ref4?.close();
    }
}
