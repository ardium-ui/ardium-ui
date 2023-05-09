import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnChanges, AfterViewChecked, OnDestroy, ElementRef, Input, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'ard-option',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumOptionComponent implements OnChanges, AfterViewChecked, OnDestroy {

    constructor(private elementRef: ElementRef<HTMLElement>) { }

    private _value: any;
    @Input()
    set value(v: any) { this._value = v; }
    get value(): any {
        return this._value ?? this.label;
    }
    get hasImplicitValue(): boolean { return this._value === undefined; }

    private _label: string | undefined = undefined;
    @Input()
    set label(v: any) { this._label = v?.toString?.() ?? String(v); }
    get label(): string {
        return this._label ?? (this.elementRef.nativeElement.innerHTML || '').trim();
    }

    private _disabled: boolean = false;
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(v: any) { this._disabled = coerceBooleanProperty(v); }
    
    //! state change listener
    readonly stateChange$ = new Subject<{ value: any, oldValue?: string, disabled: boolean, label?: string }>();

    private _previousLabel?: string;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['disabled']) {
            this.stateChange$.next({
                value: this.value,
                disabled: this.disabled,
            });
        }
    }

    ngAfterViewChecked(): void {
        if (this.label !== this._previousLabel) {
            let oldValue = this.value;
            if (this.hasImplicitValue) oldValue = this._previousLabel;

            this._previousLabel = this.label;

            this.stateChange$.next({
                value: this.value,
                oldValue,
                disabled: this.disabled,
                label: this.label,
            });
        }
    }

    ngOnDestroy(): void {
        this.stateChange$.complete();
    }
}
