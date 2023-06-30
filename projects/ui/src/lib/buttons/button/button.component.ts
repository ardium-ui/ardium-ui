import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { ComponentColor } from '../../types/colors.types';
import { ButtonAppearance, ButtonVariant } from '../general-button.types';
import { _FocusableComponentBase } from './../../_internal/focusable-component';

@Component({
  selector: 'ard-button',
  templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumButtonComponent extends _FocusableComponentBase {

    @Input() wrapperClasses: string = '';

    //* button settings
    @Input() appearance: ButtonAppearance = ButtonAppearance.Raised;
    @Input() variant: ButtonVariant = ButtonVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.Primary;
    @Input() alignIcon: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Left;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    private _vertical: boolean = false;
    @Input()
    get vertical(): boolean { return this._vertical; }
    set vertical(v: any) { this._vertical = coerceBooleanProperty(v); }

    @Input() icon?: string;

    //* for adding classes to the button
    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            `ard-color-${this.color}`,
            `ard-align-${this.alignIcon}`,
            this.compact ? 'ard-compact' : '',
            this.vertical ? 'ard-vertical' : '',
        ].join(' ');
    }
}
