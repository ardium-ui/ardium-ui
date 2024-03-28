import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { isDefined } from 'simple-bool';
import { ArdiumButtonModule } from '../buttons/button/button.module';
import { ARD_SNACKBAR_COLOR, ARD_SNACKBAR_DATA, ARD_SNACKBAR_TYPE, ArdSnackbarRef } from './snackbar-ref';
import { AsyncPipe } from '@angular/common';
import { ArdSnackbarType } from './snackbar.types';
import { ArdiumIconModule } from '../icon/icon.module';

@Component({
  selector: '_ard-simple-snackbar',
  templateUrl: './snackbar.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArdiumButtonModule, AsyncPipe, ArdiumIconModule],
  standalone: true,
})
export class _ArdSimpleSnackbar {
  public readonly snackbarRef = inject(ArdSnackbarRef);
  public readonly data = inject(ARD_SNACKBAR_DATA);
  public readonly color = inject(ARD_SNACKBAR_COLOR);
  public readonly type = inject(ARD_SNACKBAR_TYPE);

  public readonly typeIcon = this._getTypeIcon();

  closeWithAction(): void {
    this.snackbarRef.close(true);
  }

  get hasAction(): boolean {
    return isDefined(this.data.action);
  }

  private _getTypeIcon(): string | null {
    switch (this.type) {
      case ArdSnackbarType.Danger:
        return 'error';
      case ArdSnackbarType.Warning:
        return 'warning';
      case ArdSnackbarType.Success:
        return 'check_circle';
      case ArdSnackbarType.Info:
        return 'info';
    }
    return null;
  }

  get colorClass(): string {
    return `ard-color-${this.color}`;
  }
}
