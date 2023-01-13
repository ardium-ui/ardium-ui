import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { ChipContentAlignment, ChipVariant, ComponentColor, DecorationElementAppearance } from './../types/theming.types';
import { _DisablableComponent } from './../_internal/disablable-component';

@Component({
    selector: 'ard-chip',
    templateUrl: './chip.component.html',
    styleUrls: ['./chip.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumChipComponent extends _DisablableComponent {
    @Input() chipContentAlignment: ChipContentAlignment = ChipContentAlignment.Left;

    //* appearance
    @Input() appearance: DecorationElementAppearance = DecorationElementAppearance.Outlined;
    @Input() variant: ChipVariant = ChipVariant.Basic;
    @Input() color: ComponentColor = ComponentColor.Primary;

    @Input() wrapperClasses: string = '';
    get ngClasses(): string {
        return [
            this.wrapperClasses,
            `ard-chip-align-${this.chipContentAlignment}`,
            `ard-chip-variant-${this.variant}`,
            `ard-appearance-${this.appearance}`,
            `ard-color-${this.color}`,
        ].join(' ');
    }
}
