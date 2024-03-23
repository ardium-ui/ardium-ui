import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
    AfterViewInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isDefined } from 'simple-bool';

type WeightNumber = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type WeightString =
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';

type GradeNumber = -25 | 0 | 200;
type GradeString = '-25' | '0' | '200';

type OpticalSizeNumber = 20 | 24 | 40 | 48;
type OpticalSizeString = '20' | '24' | '40' | '48';

@Component({
    selector: 'ard-icon',
    templateUrl: `./icon.component.html`,
    styleUrls: ['./icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumIconComponent implements AfterViewInit {
    @Input() ariaLabel?: string;
    @Input() icon?: string | null;

    private _filled?: boolean;
    @Input()
    get filled(): boolean | undefined {
        return this._filled;
    }
    set filled(v: any) {
        this._filled = coerceBooleanProperty(v);
        this._isMemoUpToDate = false;
    }

    private _weight?: WeightNumber;
    @Input()
    get weight(): WeightNumber | undefined {
        return this._weight;
    }
    set weight(v: WeightNumber | WeightString | undefined) {
        this._weight = coerceNumberProperty(v, 400) as WeightNumber;
        this._isMemoUpToDate = false;
    }

    private _grade?: GradeNumber;
    @Input()
    get grade(): GradeNumber | undefined {
        return this._grade;
    }
    set grade(v: GradeNumber | GradeString | undefined) {
        this._grade = coerceNumberProperty(v, 0) as GradeNumber;
        this._isMemoUpToDate = false;
    }

    private _opticalSize?: OpticalSizeNumber;
    @Input()
    get opticalSize(): OpticalSizeNumber | undefined {
        return this._opticalSize;
    }
    set opticalSize(v: OpticalSizeNumber | OpticalSizeString | undefined) {
        this._opticalSize = coerceNumberProperty(v, 40) as OpticalSizeNumber;
        this._isMemoUpToDate = false;
    }

    private _isMemoUpToDate = false;
    private _fontVariationMemo: string = this.fontVariationSettings;

    get fontVariationSettings(): string {
        if (!this._isMemoUpToDate) {
            this._isMemoUpToDate = true;
            //map values to different properties defined by google icons
            let propObject = {
                FILL: isDefined(this.filled) ? Number(this.filled) : undefined,
                wght: this.weight,
                GRAD: this.grade,
                opsz: this.opticalSize,
            };
            //map the object to an array of strings
            let propObjectAsArray = Object.entries(propObject) //object to array
                .filter((v) => isDefined(v[1])) //filter undefined values
                .map((v) => `"${v[0]}" ${v[1]}`) //map key-value pairs to strings
                .flat(); //flatten

            //create the final string only if any of the properties are defined
            this._fontVariationMemo =
                propObjectAsArray.length === 0
                    ? ''
                    : ['font-variation-settings: ', ...propObjectAsArray].join(
                          '',
                      );
        }
        return this._fontVariationMemo;
    }

    @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLElement>;

    ngAfterViewInit(): void {
        if (!this.icon && !this.contentWrapper.nativeElement.innerText)
            console.warn(
                `Using <ard-icon> without specifying the [icon] field.`,
            );
    }
}
