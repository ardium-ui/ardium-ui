import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import * as Color from 'color';
import { ColorDisplayAppearance } from './color-display.types';

@Component({
    selector: 'ard-color-display',
    templateUrl: './color-display.component.html',
    styleUrls: ['./color-display.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumColorDisplayComponent implements AfterViewInit {
    @Input() ariaLabel?: string;

    private _withLabel: boolean = false;
    @Input()
    get withLabel(): boolean {
        return this._withLabel;
    }
    set withLabel(v: any) {
        this._withLabel = coerceBooleanProperty(v);
    }

    //! appearance
    @Input() appearance: ColorDisplayAppearance =
        ColorDisplayAppearance.Rounded;

    get ngClasses(): string {
        const apprncParts = this.appearance.split(' ');
        return `ard-appearance-${apprncParts[0]} ${apprncParts[1] ? 'ard-with-border' : ''}`;
    }

    //! color
    private _color?: string;
    get color(): string | null {
        return this._color ?? null;
    }
    @Input()
    set color(v: any) {
        this._color = Color(v).hex();
    }

    ngAfterViewInit(): void {
        if (!this._color)
            console.warn(
                `Using <ard-color-display> without specifying the [color] field.`,
            );
    }
}
