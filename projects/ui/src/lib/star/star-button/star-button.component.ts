import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickStrategy } from '../../types/utility.types';
import { _BooleanComponentBase } from '../../_internal/boolean-component';
import { StarColor } from '../star.types';
import { StarFillMode } from './../star.types';

@Component({
    selector: 'ard-star-button',
    templateUrl: './star-button.component.html',
    styleUrls: ['./star-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumStarButtonComponent),
            multi: true,
        },
    ],
})
export class ArdiumStarButtonComponent
    extends _BooleanComponentBase
    implements ControlValueAccessor
{
    @Input() wrapperClasses: string = '';
    @Input() clickStrategy: ClickStrategy = ClickStrategy.Default;

    //* appearance
    @Input() color: StarColor = StarColor.Star;

    get ngClasses(): string {
        return [`ard-color-${this.color}`].join(' ');
    }

    get starFillState(): StarFillMode {
        return this.selected ? 'filled' : 'none';
    }

    onClick(): void {
        if (this.clickStrategy == 'none') return;
        this.toggleSelected();
    }
}
