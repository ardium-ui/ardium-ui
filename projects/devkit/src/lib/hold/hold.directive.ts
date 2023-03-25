import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
  Detects when the user clicks-and-holds a given element.
*/
@Directive({ selector: '[ardHold]' })
export class HoldDirective {

    @Output('ardHold')
    public holdEvent = new EventEmitter<MouseEvent>();

    @Input('ardHoldDelay') holdDelay: number = 500;
    @Input('ardHoldRepeat') holdRepeat: number = 50;

    interval: NodeJS.Timeout | null = null;

    @HostListener('document:mousedown', ['$event'])
    @HostListener('document:touchstart', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        this.interval = setInterval(() => {
            this.holdEvent.next(event);
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