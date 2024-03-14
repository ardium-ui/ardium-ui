import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { isDefined } from 'simple-bool';
import { ArdiumButtonModule } from '../buttons/button/button.module';
import { ARD_SNACKBAR_DATA, ArdSnackbarRef } from './snackbar-ref';

@Component({
    selector: '_ard-simple-snack-bar',
    templateUrl: './snackbar.component.html',
    styles: ``,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ArdiumButtonModule],
    standalone: true,
})
export class _ArdSimpleSnackbar {
    public readonly snackbarRef = inject(ArdSnackbarRef);
    public readonly data = inject(ARD_SNACKBAR_DATA);

    closeWithAction(): void {
        this.snackbarRef.close(true);
    }

    get hasAction(): boolean {
        return isDefined(this.data.action);
    }
}
