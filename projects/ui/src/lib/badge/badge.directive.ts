import { ComponentRef, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { BadgePosition, BadgeSize } from './badge.types';

@Directive({
    selector: '[ardBadge]'
})
export class ArdiumBadgeDirective implements OnChanges, OnInit, OnDestroy {

    constructor(
        private _el: ElementRef,
        private _renderer: Renderer2
    ) {}

    @Input('ardBadge') text?: string | TemplateRef<unknown> | ComponentRef<unknown>;

    @Input('ardBadgeSize') size: BadgeSize = BadgeSize.Medium;
    @Input('ardBadgeColor') color: ComponentColor = ComponentColor.Primary;
    @Input('ardBadgePosition') position: BadgePosition = BadgePosition.After;

    @Input('ardBadgeAriaLabel') ariaLabel?: string;

    private _hidden: boolean = false;
    @Input('ardBadgeHidden')
    get hidden(): boolean { return this._hidden; }
    set hidden(v: any) { this._hidden = coerceBooleanProperty(v); }

    private _overlap: boolean = true;
    @Input('ardBadgeOverlap')
    get overlap(): boolean { return this._overlap; }
    set overlap(v: any) { this._overlap = coerceBooleanProperty(v); }

    private _disabled: boolean = false;
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(v: any) { this._disabled = coerceBooleanProperty(v); }

    private _createBadgeElement(): HTMLElement {
        const R = this._renderer;
        const elementClasses = [
            'ard-badge',
            `ard-badge-size-${this.size}`,
            `ard-color-${this.color}`,
            `ard-badge-position-${this.position}`,
            this.hidden ? 'ard-badge-hidden' : '',
            this.overlap ? 'ard-badge-overlap' : 'ard-badge-no-overlap',
        ].join(' ');
        const element = R.createElement('div') as HTMLDivElement;
        R.addClass(element, elementClasses);
        R.setAttribute(element, 'aria-label', this.ariaLabel ?? '');
        
        return element;
    }

    private _badgeElement?: HTMLElement;
    ngOnChanges(): void {
        if (this._badgeElement) {
            this._renderer.removeChild(this._el, this._badgeElement);
        }
        const element = this._createBadgeElement();
        this._badgeElement = element;
        this._renderer.appendChild(this._el, this._badgeElement);
    }

    ngOnInit(): void {
        this._renderer.addClass(this._el, 'ard-badge-host');
    }
    ngOnDestroy(): void {
        if (this._badgeElement) {
            this._renderer.removeChild(this._el, this._badgeElement);
        }
        this._renderer.removeClass(this._el, 'ard-badge-host');
    }
}
