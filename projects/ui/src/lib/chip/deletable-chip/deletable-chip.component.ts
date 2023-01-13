
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ChipContentAlignment, DecorationElementAppearance } from '../../types/theming.types';
import { _FocusableComponent } from '../../_internal/focusable-component';
import { ChipVariant, ComponentColor } from './../../types/theming.types';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ard-deletable-chip',
    templateUrl: './deletable-chip.component.html',
    styleUrls: ['../chip.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumDeletableChipComponent),
            multi: true
        }
    ]
})
export class ArdiumDeletableChipComponent extends _FocusableComponent {

    readonly DEFAULTS = {
        deleteButtonTitle: 'Delete',
    }

    @Input() deleteButtonTitle: string = this.DEFAULTS.deleteButtonTitle;
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
    //* events
    @Output('delete') deleteEvent = new EventEmitter<MouseEvent>();
}
