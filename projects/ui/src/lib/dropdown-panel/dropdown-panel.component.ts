import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { DropdownPanelAppearance, DropdownPanelVariant, ScrollAlignment } from './dropdown-panel.types';

@Component({
    selector: 'ard-dropdown-panel',
    templateUrl: './dropdown-panel.component.html',
    styleUrls: ['./dropdown-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumDropdownPanelComponent implements AfterViewInit, AfterViewChecked {
    
    constructor() { }

    @ViewChild('scroll', { static: true }) private _scrollRef!: ElementRef;
    private _scrollElement!: HTMLElement;

    //! options
    @Input() panelId!: string;
    @Input() headerTemplate?: TemplateRef<any>;
    @Input() footerTemplate?: TemplateRef<any>;
    @Input() filterValue?: string;

    //! appearance
    @Input() appearance: DropdownPanelAppearance = DropdownPanelAppearance.Raised;
    @Input() variant: DropdownPanelVariant = DropdownPanelVariant.Rounded;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }

    //! states
    @Input() @HostBinding('class.ard-open') isOpen!: boolean;

    //! output events
    @Output('scroll') scrollEvent = new EventEmitter<{ start: number, end: number }>();
    @Output('scrollToEnd') scrollToEndEvent = new EventEmitter();

    //! event handlers
    onScroll() {
        const start = this._scrollTop;
        const end = this._scrollBottom;
        this.scrollEvent.emit({ start, end });

        if (end == this._scrollElement.scrollHeight) {
            this.scrollToEndEvent.emit();
        }
    }

    //! hooks
    ngAfterViewInit(): void {
        this._scrollElement = this._scrollRef.nativeElement as HTMLElement;
    }
    ngAfterViewChecked(): void {
        if (!this._currentScrollToDirection) return;

        const recent = this._scrollElement.querySelector<HTMLElement>('.ard-option-highlighted-recent');
        if (!recent) return;

        const isInView = this._isElementInView(recent);
        if (!isInView) {
            this._scrollToElement(recent, this._currentScrollToDirection);
        }

        this._currentScrollToDirection = null;
    }

    //! scroll position
    private get _scrollTop(): number {
        return this._scrollElement.scrollTop;
    }
    private set _scrollTop(value: number) {
        this._scrollElement.scrollTop = value;
    }
    private get _scrollBottom(): number {
        return this._scrollTop + this._scrollElement.getBoundingClientRect().height;
    }

    //! scroll to element methods
    private _scrollToElement(el: HTMLElement, alignTo: ScrollAlignment = 'middle'): void {
        const parentContentRect = this._getContentRect(this._scrollElement);
        const elementRect = el.getBoundingClientRect();

        switch (alignTo) {
            case 'top':
                this._scrollTop += elementRect.top - parentContentRect.top;
                break;
            case 'bottom':
                this._scrollTop += elementRect.bottom - parentContentRect.bottom;
                break;
            case 'middle':
                this._scrollTop += (elementRect.top + elementRect.bottom) / 2 - parentContentRect.top - parentContentRect.height / 2;
                break;
        }
    }

    private _currentScrollToDirection: ScrollAlignment | null = null;
    scrollToRecentlyHighlighted(direction: ScrollAlignment): void {
        this._currentScrollToDirection = direction;
    }
    private _isElementInView(el: HTMLElement): boolean {
        const parentContentRect = this._getContentRect(this._scrollElement);
        const elementRect = el.getBoundingClientRect();
        return (
            elementRect.bottom < parentContentRect.bottom &&
            elementRect.top > parentContentRect.top
        );
    }
    private _getContentRect(el: HTMLElement): DOMRect {
        const elRect = el.getBoundingClientRect();
        const elPadding = window.getComputedStyle(el).getPropertyValue('padding');
        const paddings = elPadding.split(' ').map(v => v ? parseFloat(v) : null);
        const topPadd = paddings[0] ?? 0;
        const rightPadd = paddings[1] ?? topPadd;
        const bottomPadd = paddings[2] ?? topPadd;
        const leftPadd = paddings[3] ?? rightPadd ?? topPadd;
        return new DOMRect(elRect.x + leftPadd, elRect.y + topPadd, elRect.width - leftPadd - rightPadd, elRect.height - topPadd - bottomPadd);
    }
}