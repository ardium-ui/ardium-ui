import { Component, ViewEncapsulation } from '@angular/core';
import { BadgeSize as BS, BadgePosition, ComponentColor as CC, FormElementVariant as FEV } from '@ardium-ui/ui';

@Component({
    selector: 'app-badge',
    templateUrl: './badge.page.html',
    styleUrls: ['./badge.page.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BadgePage {
    variants: FEV[] = [FEV.Rounded, FEV.Pill, FEV.Sharp];
    colors: CC[] = Object.values(CC);
    sizes: BS[] = Object.values(BS);
    positionItems = [
        { value: BadgePosition.AboveBefore, label: '' },
        { value: null, disabled: true, label: '' },
        { value: null, disabled: true, label: '' },
        { value: BadgePosition.AboveAfter, label: '' },
        { value: null, disabled: true, label: '' },
        { value: null, disabled: true, label: '' },
        { value: null, disabled: true, label: '' },
        { value: null, disabled: true, label: '' },
        { value: BadgePosition.BelowBefore, label: '' },
        { value: null, disabled: true, label: '' },
        { value: null, disabled: true, label: '' },
        { value: BadgePosition.BelowAfter, label: '' },
    ];

    variant: FEV[] = [FEV.Pill];
    color: CC[] = [CC.Primary];
    size: BS[] = [BS.Medium];
    position: BadgePosition[] = [BadgePosition.AboveAfter];
    hidden: boolean = false;
    overlap: boolean = true;
    addTo: 'text' | 'button' = 'button';
    ariaLabel: string | null = "Example badge";
    text: string | null = "NEW!";

}
