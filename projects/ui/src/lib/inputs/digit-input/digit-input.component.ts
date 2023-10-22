import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef } from '@angular/core';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ard-digit-input',
    templateUrl: './digit-input.component.html',
    styleUrls: ['./digit-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumDigitInputComponent),
            multi: true
        }
    ]
})
export class ArdiumDigitInputComponent extends _NgModelComponentBase implements ControlValueAccessor {

}
