import { FocusMonitor } from '@angular/cdk/a11y';
import { Directive, ElementRef, EventEmitter, HostBinding, inject, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from "@angular/core";
import { coerceNumberProperty } from '../../../../devkit/src/public-api';
import { _DisablableComponent } from './disablable-component';

@Directive()
export abstract class _FocusableComponent extends _DisablableComponent implements OnInit, OnDestroy {
    private readonly _focusMonitor = inject(FocusMonitor);

    //! make the component focusable programmatically
    @ViewChildren('focusableElement')
    private readonly _focusableElement!: QueryList<ElementRef<HTMLElement>>;

    public focus(): void {
        this._focusableElement?.first?.nativeElement.focus();
    }
    public focusFirst(): void { this.focus(); }
    public focusLast(): void {
        this._focusableElement?.last?.nativeElement.focus();
    }
    public blur(): void {
        this._focusableElement?.forEach(el => el.nativeElement.blur())
    }

    //! tabindex
    protected _tabIndex: number = 0;
    @Input()
    get tabIndex(): number { return this._disabled ? -1 : this._tabIndex; }
    set tabIndex(v: any) { this._tabIndex = coerceNumberProperty(v, 0); }

    //! events
    @Output('focus') focusEvent = new EventEmitter<FocusEvent>();
    @Output('blur') blurEvent = new EventEmitter<FocusEvent>();

    //* focus origin
    //! temporarily removed
    // @ViewChild('buttonElement', { static: true }) buttonEl!: HTMLButtonElement;
    ngOnInit(): void {
        // this._focusMonitor.monitor(this.buttonEl);
    }
    ngOnDestroy(): void {
        // this._focusMonitor.stopMonitoring(this.buttonEl);
    }

    //! focus event handlers
    @HostBinding('class.ard-focused')
    public isFocused: boolean = false;

    onFocus(event: FocusEvent) {
        this.isFocused = true;
        this.focusEvent.emit(event);
    }
    onBlur(event: FocusEvent) {
        this.isFocused = false;
        this.blurEvent.emit(event);
    }
}