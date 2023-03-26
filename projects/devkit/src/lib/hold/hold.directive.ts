import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
  Detects when the user clicks-and-holds a given element.
*/
@Directive({ selector: '[ardHold]' })
export class HoldDirective {

    @Output('ardHold')
    public holdEvent = new EventEmitter<null>();

    @Input('ardHoldDelay') holdDelay: number = 800;
    @Input('ardHoldRepeat') holdRepeat: number = 100;

    interval: NodeJS.Timeout | null = null;

    @HostListener('document:mousedown')
    @HostListener('document:touchstart')
    public onMouseDown(): void {
        this.interval = setInterval(() => {
            this.holdEvent.next(null);
        }, this.holdRepeat);
    }

    @HostListener('document:mouseup')
    @HostListener('document:touchend')
    public onMouseUp(): void {
        if (!this.interval) return;

        clearInterval(this.interval);
        this.interval = null;
    }
}