
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { ComponentColor } from '../../types/colors.types';
import { DecorationElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _FocusableComponentBase } from '../../_internal/focusable-component';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

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
export class ArdiumDeletableChipComponent extends _FocusableComponentBase {

    readonly DEFAULTS = {
        deleteButtonTitle: 'Delete',
    }

    @Input() deleteButtonTitle: string = this.DEFAULTS.deleteButtonTitle;
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
    //* events
    @Output('delete') deleteEvent = new EventEmitter<MouseEvent>();
}
