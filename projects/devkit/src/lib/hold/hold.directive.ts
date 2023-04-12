import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
  Detects when the user clicks-and-holds a given element.
*/
@Directive({ selector: '[ardHold]' })
export class HoldDirective {

    @Output('ardHold')
    public holdEvent = new EventEmitter<undefined>();

    @Input() set disabled(v: any) { this._clear(); }
    @Input() set readonly(v: any) { this._clear(); }

    @Input('ardHoldDelay') holdDelay: number = 500;
    @Input('ardHoldRepeat') holdRepeat: number = 1000/15;

    interval: NodeJS.Timeout | null = null;
    timeout: NodeJS.Timeout | null = null;

    @HostListener('mousedown')
    @HostListener('touchstart')
    public onMouseDown(): void {
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.interval = setInterval(() => {
                this.holdEvent.next(undefined);
            }, this.holdRepeat);
        }, this.holdDelay);
    }

    @HostListener('mouseup')
    @HostListener('touchend')
    public onMouseUp(): void {
        this._clear();
    }
    private _clear(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
            return;
        }
        if (!this.interval) return;

        clearInterval(this.interval);
        this.interval = null;
    }
}