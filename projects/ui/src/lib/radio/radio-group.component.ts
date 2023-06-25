import { ChangeDetectionStrategy, Component, ContentChildren, ViewEncapsulation, QueryList, Input } from '@angular/core';
import { ArdiumRadioComponent } from './radio/radio.component';

@Component({
    selector: 'ard-radio-group',
    template: '<ng-content></ng-content>',
    styleUrls: ['./radio-group.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumRadioGroupComponent {
}
