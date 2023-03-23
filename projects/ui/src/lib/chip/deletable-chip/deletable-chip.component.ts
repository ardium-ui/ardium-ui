
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { _FocusableComponent } from '../../_internal/focusable-component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { DecorationElementAppearance } from '../../types/theming.types';
import { ChipVariant } from '../chip.types';
import { ComponentColor } from '../../types/colors.types';

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
    @Input() contentAlignment: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Left;

    //* appearance
    @Input() appearance: DecorationElementAppearance = DecorationElementAppearance.Outlined;
    @Input() variant: ChipVariant = ChipVariant.Basic;
    @Input() color: ComponentColor = ComponentColor.Primary;

    @Input() wrapperClasses: string = '';
    get ngClasses(): string {
        return [
            this.wrapperClasses,
            `ard-chip-align-${this.contentAlignment}`,
            `ard-chip-variant-${this.variant}`,
            `ard-appearance-${this.appearance}`,
            `ard-color-${this.color}`,
        ].join(' ');
    }
    //* events
    @Output('delete') deleteEvent = new EventEmitter<MouseEvent>();
}
