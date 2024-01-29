import { Component, signal } from '@angular/core';
import { PanelAppearance, PanelVariant } from '@ardium-ui/ui';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.page.html',
    styleUrl: './modal.page.scss',
})
export class ModalPage {
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
}
