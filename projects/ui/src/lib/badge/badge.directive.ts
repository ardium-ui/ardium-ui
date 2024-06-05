import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  Renderer2,
  TemplateRef,
  signal,
  input,
  computed,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { BadgePosition, BadgeSize } from './badge.types';
import { FormElementVariant } from '../types/theming.types';
import { Nullable } from '../types/utility.types';

@Directive({
  selector: '[ardBadge]',
})
export class ArdiumBadgeDirective implements OnChanges, AfterViewInit, OnDestroy {
  constructor(private _elRef: ElementRef, private _renderer: Renderer2) {}

  readonly text = input<string>('', { alias: 'ardBadge' });

  readonly color = input<ComponentColor>(ComponentColor.Primary, { alias: 'ardBadgeColor' });
  readonly variant = input<FormElementVariant>(FormElementVariant.Pill, { alias: 'ardBadgeVariant' });
  readonly size = input<BadgeSize>(BadgeSize.Medium, { alias: 'ardBadgeSize' });

  readonly position = input<BadgePosition, BadgePosition>(BadgePosition.AboveAfter, {
    alias: 'ardBadgePosition',
    transform: v => {
      switch (v) {
        case BadgePosition.Before:
          return BadgePosition.AboveBefore;
        case BadgePosition.After:
        case BadgePosition.Above:
          return BadgePosition.AboveAfter;
        case BadgePosition.Below:
          return BadgePosition.BelowAfter;

        default:
          return v;
      }
    },
  });

  readonly ariaLabel = input<string>('', { alias: 'ardBadgeAriaLabel' });

  readonly hidden = input<boolean, any>(false, { alias: 'ardBadgeHidden', transform: v => coerceBooleanProperty(v) });
  readonly overlap = input<boolean, any>(false, { alias: 'ardBadgeOverlap', transform: v => coerceBooleanProperty(v) });

  private readonly _elementClasses = computed(() =>
    [
      'ard-badge',
      `ard-color-${this.color()}`,
      `ard-variant-${this.variant()}`,
      `ard-badge-size-${this.size()}`,
      `ard-badge-position-${this.position()}`,
      this.hidden() ? 'ard-badge-hidden' : '',
      this.overlap() ? 'ard-badge-overlap' : 'ard-badge-no-overlap',
    ].join(' ')
  );

  private _createBadgeElement(): HTMLElement {
    try {
      const R = this._renderer;
      const element = R.createElement('div') as HTMLDivElement;
      R.setAttribute(element, 'class', this._elementClasses());
      R.setAttribute(element, 'aria-label', this.ariaLabel());

      if (this.text) {
        const textHost = R.createElement('div') as HTMLDivElement;
        R.addClass(textHost, 'ard-badge-content');

        const text = R.createText(this.text());
        R.appendChild(textHost, text);
        R.appendChild(element, textHost);
      }

      return element;
    } catch (error: unknown) {
      if (error instanceof Error) {
        error.message = 'ARD-FT4030: An unknown error has occured while rendering ardBadge: ' + error.message;
        throw error;
      }
      throw new Error(`ARD-FT4030: An unknown error has occured while rendering ardBadge: ` + error);
    }
  }

  private readonly _badgeElement = signal<Nullable<HTMLElement>>(undefined);
  ngOnChanges(): void {
    if (this._badgeElement()) {
      this._renderer.removeChild(this._elRef.nativeElement, this._badgeElement());
    }
    const element = this._createBadgeElement();
    this._badgeElement.set(element);
    this._renderer.appendChild(this._elRef.nativeElement, element);
  }

  ngAfterViewInit(): void {
    this._renderer.addClass(this._elRef.nativeElement, 'ard-badge-host');
  }
  ngOnDestroy(): void {
    if (this._badgeElement()) {
      this._renderer.removeChild(this._elRef.nativeElement, this._badgeElement());
    }
    this._renderer.removeClass(this._elRef.nativeElement, 'ard-badge-host');
  }
}
