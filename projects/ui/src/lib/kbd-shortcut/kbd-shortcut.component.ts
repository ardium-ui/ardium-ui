import { ChangeDetectionStrategy, Component, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance } from '../types/theming.types';

@Component({
  selector: 'ard-kbd-shortcut',
  templateUrl: './kbd-shortcut.component.html',
  styleUrls: ['./kbd-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumKbdShortcutComponent implements AfterViewInit {

    @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLElement>;

    ngAfterViewInit(): void {
        if (!this.keys && !this.contentWrapper.nativeElement.innerText) console.warn(`Using <ard-kbd-shortcut> without specifying the [keys] field.`);
    }

    readonly splitRegex = /[+ ]/;

    private _keys?: string[];
    @Input()
    set keys(v: string | string[] | undefined) {
        //assign from string
        if (typeof v == 'string') {
            this._keys = v.split(this.splitRegex);
            return;
        }
        //assign undefined or array
        this._keys = v && [...v];
    }
    get keys(): string[] | undefined { return this._keys; }

    private _full: boolean = false;
    @Input()
    get full(): boolean { return this._full; }
    set full(v: any) { this._full = coerceBooleanProperty(v); }

    //! appearance
    @Input() appearance: FormElementAppearance = FormElementAppearance.Filled;

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
        ].join(' ');
    }
}
