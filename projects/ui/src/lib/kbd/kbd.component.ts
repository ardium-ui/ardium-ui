import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance } from './../types/theming.types';

@Component({
    selector: 'ard-kbd',
    templateUrl: './kbd.component.html',
    styleUrls: ['./kbd.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumKbdComponent implements AfterViewInit {
    @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLElement>;

    ngAfterViewInit(): void {
        if (!this.key && !this.contentWrapper.nativeElement.innerText)
            console.warn(`Using <ard-kbd> without specifying the [key] field.`);
    }

    @Input() key?: string;

    private _full: boolean = false;
    @Input()
    get full(): boolean {
        return this._full;
    }
    set full(v: any) {
        this._full = coerceBooleanProperty(v);
    }

    //! appearance
    @Input() appearance: FormElementAppearance = FormElementAppearance.Filled;

    get ngClasses(): string {
        return [`ard-appearance-${this.appearance}`].join(' ');
    }
}
