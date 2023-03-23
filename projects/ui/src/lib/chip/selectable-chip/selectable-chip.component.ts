import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _BooleanComponent } from './../../_internal/boolean-component';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { DecorationElementAppearance } from '../../types/theming.types';
import { ChipVariant } from '../chip.types';
import { ComponentColor } from '../../types/colors.types';

@Component({
    selector: 'ard-selectable-chip',
    templateUrl: './selectable-chip.component.html',
    styleUrls: ['../chip.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumSelectableChipComponent),
            multi: true
        }
    ]
})
export class ArdiumSelectableChipComponent extends _BooleanComponent implements ControlValueAccessor {
    
    readonly DEFAULTS = {
        chipTitle: 'Select',
    }

    @Input() chipTitle: string = this.DEFAULTS.chipTitle;
    @Input() useSelectionIcon: boolean = true;
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
}