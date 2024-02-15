import { Component, signal, effect } from '@angular/core';
import { PanelAppearance, PanelVariant } from '@ardium-ui/ui';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.page.html',
    styleUrl: './dialog.page.scss',
})
export class DialogPage {
    readonly isOpenMain = signal(false);
    appearance: PanelAppearance = PanelAppearance.Raised;
    variant: PanelVariant = PanelVariant.Rounded;
    readonly compact = signal(false);
    readonly noCloseButton = signal(false);
    readonly noBackdrop = signal(false);
    readonly disableBackdropClose = signal(false);

    readonly appearances = Object.values(PanelAppearance);
    readonly variants = Object.values(PanelVariant);

    readonly isOpen1 = signal(false);
    readonly isOpen2 = signal(false);
    readonly isOpen3 = signal(false);
    readonly isOpen4 = signal(false);
    readonly isOpen5 = signal(false);
    readonly isOpen6 = signal(false);
    readonly isOpen7 = signal(false);

    //! delete confirmation
    readonly canConfirmDelete = signal<boolean>(false);
    readonly deleteConfirmationTimeout = signal<NodeJS.Timeout | null>(null);
    clearDeleteConfirmationTimeout() {
        const prevTimeout = this.deleteConfirmationTimeout();
        if (prevTimeout) {
            clearTimeout(prevTimeout);
        }
    }
    openDeleteConfirmationDialog() {
        console.log('openDeleteConfirmationDialog');
        this.isOpen3.set(true);
        this.canConfirmDelete.set(false);
        const newTimeout = setTimeout(() => {
            clearTimeout(newTimeout);
            this.canConfirmDelete.set(true);
        }, 3000);
    }
    onDeleteConfirm() {
        alert('File has been deleted.');
    }
}
