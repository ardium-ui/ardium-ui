import { Component, inject } from '@angular/core';
import { ArdiumSnackbarService } from '@ardium-ui/ui';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.page.html',
  styleUrl: './snackbar.page.scss'
})
export class SnackbarPage {
    private readonly _snackbarService = inject(ArdiumSnackbarService);

    openSnackbar1() {
        const ref = this._snackbarService.open('Hello world!');
    }
    openSnackbar2() {
        const ref = this._snackbarService.open('Hello world!', 'Dismiss');
    }
}
