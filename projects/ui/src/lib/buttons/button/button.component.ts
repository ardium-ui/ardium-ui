import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ButtonAppearance, ButtonVariant, ComponentColor } from '../../types/theming.types';
import { _FocusableComponent } from './../../_internal/focusable-component';

@Component({
  selector: 'ard-button',
  templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumButtonComponent extends _FocusableComponent {

    @Input() wrapperClasses: string = '';

    //* button settings
    @Input() appearance: ButtonAppearance = ButtonAppearance.Raised;
    @Input() variant: ButtonVariant = ButtonVariant.Basic;
    @Input() color: ComponentColor = ComponentColor.Primary;

    @Input() icon?: string;

    //* for adding classes to the button
    get ngClasses(): string {
        const buttonVariant = this.variant
            .split(' ')
            .map(cls => 'ard-button-' + cls);
        return [
            `ard-appearance-${this.appearance}`,
            `ard-color-${this.color}`,
            ...buttonVariant
        ].join(' ');
    }
}
