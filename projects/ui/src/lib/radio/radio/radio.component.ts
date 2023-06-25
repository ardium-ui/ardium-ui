import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ComponentColor } from '@ardium-ui/ui';
import { _BooleanComponentBase } from '../../_internal/boolean-component';

@Component({
    selector: 'ard-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumRadioComponent extends _BooleanComponentBase {
    @Input() htmlId: string = crypto.randomUUID();

    @Input() value: any;

    //! appearance
    @Input() color: ComponentColor = ComponentColor.Primary;

    get ngClasses(): string {
        return [
            `ard-color-${this.color}`,
            `ard-radio-${this.selected ? 'selected' : 'unselected'}`,
        ].join(' ');
    }

    //! radio-group access points
    name: string | null = null;
}
