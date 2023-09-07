import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ComponentColor } from '../../types/colors.types';
import { _FocusableComponentBase } from '../../_internal/focusable-component';
import { ButtonAppearance, FABSize } from '../general-button.types';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'ard-fab',
  templateUrl: './fab.component.html',
    styleUrls: ['./fab.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumFabComponent extends _FocusableComponentBase {

    @Input() wrapperClasses: string = '';

    //* button settings
    @Input() appearance: ButtonAppearance = ButtonAppearance.Raised;
    @Input() size: FABSize = FABSize.Standard;
    @Input() color: ComponentColor = ComponentColor.Primary;

    private _extended: boolean = false;
    @Input()
    get extended(): boolean { return this._extended; }
    set extended(v: any) { this._extended = coerceBooleanProperty(v); }

    //* for adding classes to the button
    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-color-${this.color}`,
            `ard-fab-size-${this.size}`,
            this.extended ? 'ard-fab-extended' : '',
        ].join(' ');
    }
}
