import { ComponentRef, Directive, ElementRef, Input, OnChanges, OnDestroy, AfterViewInit, Renderer2, TemplateRef } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { BadgePosition, BadgeSize } from './badge.types';
import { FormElementVariant } from '../types/theming.types';

@Directive({
    selector: '[ardBadge]'
})
export class ArdiumBadgeDirective implements OnChanges, AfterViewInit, OnDestroy {

    constructor(
        private _el: ElementRef,
        private _renderer: Renderer2
    ) {}

    @Input('ardBadge') text?: string;

    @Input('ardBadgeColor') color: ComponentColor = ComponentColor.Primary;
    @Input('ardBadgeVariant') variant: FormElementVariant = FormElementVariant.Pill;
    @Input('ardBadgeSize') size: BadgeSize = BadgeSize.Medium;

    private _position: BadgePosition = BadgePosition.AboveAfter;
    @Input('ardBadgePosition')
    get position(): BadgePosition { return this._position; }
    set position(v: BadgePosition) {
        switch (v) {
            case BadgePosition.Before:
                this._position = BadgePosition.AboveBefore;
                return;
            case BadgePosition.After:
            case BadgePosition.Above:
                this._position = BadgePosition.AboveAfter;
                return;
            case BadgePosition.Below:
                this._position = BadgePosition.BelowAfter;
                return;
        
            default:
                this._position = v;
                return;
        }
    }

    @Input('ardBadgeAriaLabel') ariaLabel?: string;

    private _hidden: boolean = false;
    @Input('ardBadgeHidden')
    get hidden(): boolean { return this._hidden; }
    set hidden(v: any) { this._hidden = coerceBooleanProperty(v); }

    private _overlap: boolean = true;
    @Input('ardBadgeOverlap')
    get overlap(): boolean { return this._overlap; }
    set overlap(v: any) { this._overlap = coerceBooleanProperty(v); }

    private _createBadgeElement(): HTMLElement {
        const R = this._renderer;
        const elementClasses = [
            'ard-badge',
            `ard-color-${this.color}`,
            `ard-variant-${this.variant}`,
            `ard-badge-size-${this.size}`,
            `ard-badge-position-${this.position}`,
            this.hidden ? 'ard-badge-hidden' : '',
            this.overlap ? 'ard-badge-overlap' : 'ard-badge-no-overlap',
        ].join(' ');
        const element = R.createElement('div') as HTMLDivElement;
        R.setAttribute(element, 'class', elementClasses);
        R.setAttribute(element, 'aria-label', this.ariaLabel ?? '');
        
        if (this.text) {
            const textHost = R.createElement('div') as HTMLDivElement;
            R.addClass(textHost, 'ard-badge-content');

            const text = R.createText(this.text ?? '');
            R.appendChild(textHost, text);
            R.appendChild(element, textHost);
        }
        
        return element;
    }

    private _badgeElement?: HTMLElement;
    ngOnChanges(): void {
        if (this._badgeElement) {
            this._renderer.removeChild(this._el.nativeElement, this._badgeElement);
        }
        const element = this._createBadgeElement();
        this._badgeElement = element;
        this._renderer.appendChild(this._el.nativeElement, this._badgeElement);
    }

    ngAfterViewInit(): void {
        this._renderer.addClass(this._el.nativeElement, 'ard-badge-host');
    }
    ngOnDestroy(): void {
        if (this._badgeElement) {
            this._renderer.removeChild(this._el.nativeElement, this._badgeElement);
        }
        this._renderer.removeClass(this._el.nativeElement, 'ard-badge-host');
    }
}
