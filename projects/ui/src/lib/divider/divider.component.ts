import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
    selector: 'ard-divider',
    template: '',
    styleUrls: ['./divider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumDividerComponent {
    private _vertical: boolean = false;
    @Input()
    @HostBinding('class.ard-divider-vertical')
    get vertical(): boolean {
        return this._vertical;
    }
    set vertical(v: any) {
        this._vertical = coerceBooleanProperty(v);
    }
}
