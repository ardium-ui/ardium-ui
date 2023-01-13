import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { ButtonAppearance, ComponentColor, FABSize } from '../../types/theming.types';
import { _FocusableComponent } from '../../_internal/focusable-component';
import { coerceBooleanProperty } from './../../utils';

@Component({
  selector: 'ard-fab',
  templateUrl: './fab.component.html',
    styleUrls: ['./fab.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumFabComponent extends _FocusableComponent {

    @Input() wrapperClasses: string = '';

    //* button settings
    @Input() appearance: ButtonAppearance = ButtonAppearance.Raised;
    @Input() size: FABSize = FABSize.Standard;
    @Input() color: ComponentColor = ComponentColor.Primary;

    @Input() icon?: string;

    //* for adding classes to the button
    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-color-${this.color}`,
            `ard-fab-size-${this.size}`,
        ].join(' ');
    }
}
