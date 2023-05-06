import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
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
    @Input() variant: ButtonVariant = ButtonVariant.Basic;
    @Input() color: ComponentColor = ComponentColor.Primary;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    @Input() icon?: string;

    //* for adding classes to the button
    get ngClasses(): string {
        const buttonVariant = this.variant
            .split(' ')
            .map(cls => 'ard-button-' + cls);
        return [
            `ard-appearance-${this.appearance}`,
            `ard-color-${this.color}`,
            ...buttonVariant,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }
}
