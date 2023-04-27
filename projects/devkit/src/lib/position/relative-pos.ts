
import { ElementRef } from '@angular/core';

export class EventRelativePos {
    readonly overflowsTop!: boolean;
    readonly overflowsRight!: boolean;
    readonly overflowsBottom!: boolean;
    readonly overflowsLeft!: boolean;
    readonly overflows!: boolean;
    
    constructor(
        public readonly top: number,
        public readonly right: number,
        public readonly bottom: number,
        public readonly left: number,
    ) {
        this.overflowsTop = top < 0;
        this.overflowsRight = right < 0;
        this.overflowsBottom = bottom < 0;
        this.overflowsLeft = left < 0;
        this.overflows = this.overflowsTop || this.overflowsRight || this.overflowsBottom || this.overflowsLeft;
    }

    toJSON(): string {
        return JSON.stringify({
            top: this.top,
            right: this.right,
            bottom: this.bottom,
            left: this.left,
        });
    }

    static fromEvent(event: MouseEvent, el: HTMLElement): EventRelativePos;
    static fromEvent(event: MouseEvent, el: ElementRef<HTMLElement>): EventRelativePos;
    static fromEvent(event: MouseEvent, el: HTMLElement | ElementRef<HTMLElement>): EventRelativePos;
    static fromEvent(event: MouseEvent, el: HTMLElement | ElementRef<HTMLElement>): EventRelativePos {
        return getEventRelativePos(event, el);
    }
}

export function getEventRelativePos(event: MouseEvent, el: HTMLElement): EventRelativePos;
export function getEventRelativePos(event: MouseEvent, el: ElementRef<HTMLElement>): EventRelativePos;
export function getEventRelativePos(event: MouseEvent, el: HTMLElement | ElementRef<HTMLElement>): EventRelativePos;
export function getEventRelativePos(event: MouseEvent, el: HTMLElement | ElementRef<HTMLElement>): EventRelativePos {
    if (el instanceof ElementRef) el = el.nativeElement;
    const elRect = el.getBoundingClientRect();

    const eventX = event.clientX;
    const eventY = event.clientY;

    return new EventRelativePos(
        eventY - elRect.top, //top
        elRect.right - eventX, //right
        elRect.bottom - eventY, //bottom
        eventX - elRect.left, //left
    );
}