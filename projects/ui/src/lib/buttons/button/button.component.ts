import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { _ButtonBase } from '../_button-base';
import { ButtonVariant } from '../general-button.types';

@Component({
    selector: 'ard-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumButtonComponent extends _ButtonBase {
    //* button settings
    @Input() variant: ButtonVariant = ButtonVariant.Rounded;
    @Input() alignIcon: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Left;

    private _vertical: boolean = false;
    @Input()
    get vertical(): boolean {
        return this._vertical;
    }
    set vertical(v: any) {
        this._vertical = coerceBooleanProperty(v);
    }

    @Input() icon?: string;

    //* for adding classes to the button
    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            `ard-color-${this.color}`,
            `ard-align-${this.alignIcon}`,
            this.lightColoring ? `ard-light-coloring` : '',
            this.compact ? 'ard-compact' : '',
            this.vertical ? 'ard-button-vertical' : '',
        ].join(' ');
    }
}
