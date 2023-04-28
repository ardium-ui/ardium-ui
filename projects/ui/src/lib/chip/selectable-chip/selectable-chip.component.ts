import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { ComponentColor } from '../../types/colors.types';
import { DecorationElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _BooleanComponentBase } from './../../_internal/boolean-component';

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
export class ArdiumSelectableChipComponent extends _BooleanComponentBase implements ControlValueAccessor {
    
    readonly DEFAULTS = {
        chipTitle: 'Select',
    }

    @Input() chipTitle: string = this.DEFAULTS.chipTitle;
    @Input() useSelectionIcon: boolean = true;
    @Input() contentAlignment: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Left;

    //* appearance
    @Input() appearance: DecorationElementAppearance = DecorationElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.Primary;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    @Input() wrapperClasses: string = '';
    get ngClasses(): string {
        return [
            this.wrapperClasses,
            `ard-chip-align-${this.contentAlignment}`,
            `ard-variant-${this.variant}`,
            `ard-appearance-${this.appearance}`,
            `ard-color-${this.color}`,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }
}