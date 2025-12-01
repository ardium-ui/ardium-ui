import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DomPortal, TemplatePortal } from '@angular/cdk/portal';
import { computed, Directive, ElementRef, HostListener, inject, input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isString } from 'simple-bool';
import { ARD_TOOLTIP_DEFAULTS } from './tooltip.defaults';
import { ArdiumTooltipAlign, ArdiumTooltipPosition } from './tooltip.types';

@Directive({
  selector: '[ardTooltip]',
  standalone: false,
})
export class ArdiumTooltipDirective implements OnDestroy {
  protected readonly _DEFAULTS = inject(ARD_TOOLTIP_DEFAULTS);
  private readonly _overlay = inject(Overlay);
  private readonly _scrollStrategyOpts = inject(ScrollStrategyOptions);
  private readonly _hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  readonly showDelay = input<number, any>(this._DEFAULTS.showDelay, {
    alias: 'ardTooltipShowDelay',
    transform: v => coerceNumberProperty(v, this._DEFAULTS.showDelay),
  });
  readonly hideDelay = input<number, any>(this._DEFAULTS.hideDelay, {
    alias: 'ardTooltipHideDelay',
    transform: v => coerceNumberProperty(v, this._DEFAULTS.hideDelay),
  });

  readonly content = input.required<string | TemplateRef<undefined>>({ alias: 'ardTooltip' });

  readonly disabled = input<boolean, any>(this._DEFAULTS.disabled, {
    alias: 'ardTooltipDisabled',
    transform: v => coerceBooleanProperty(v),
  });

  readonly position = input<ArdiumTooltipPosition>(this._DEFAULTS.position, { alias: 'ardTooltipPosition' });
  readonly align = input<ArdiumTooltipAlign>(this._DEFAULTS.align, { alias: 'ardTooltipAlign' });

  readonly panelClass = input<string | undefined>(this._DEFAULTS.panelClass, { alias: 'ardTooltipPanelClass' });
  readonly cardPanel = input<boolean, any>(this._DEFAULTS.cardPanel, {
    alias: 'ardTooltipCardPanel',
    transform: v => coerceBooleanProperty(v),
  });
  readonly withArrow = input<boolean, any>(this._DEFAULTS.withArrow, {
    alias: 'ardTooltipWithArrow',
    transform: v => coerceBooleanProperty(v),
  });

  private _dropdownOverlay?: OverlayRef;

  private _createOverlay(): void {
    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this._hostEl)
      .withFlexibleDimensions(true)
      .withPositions(this._connectedPositions());

    const config = new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy: this._scrollStrategyOpts.block(),
      hasBackdrop: false,
      panelClass: [
        'ard-tooltip',
        this.cardPanel() ? 'ard-tooltip__card-panel' : '',
        this.withArrow() ? 'ard-tooltip__with-arrow' : '',
        this.panelClass() || '',
      ],
    });

    this._dropdownOverlay = this._overlay.create(config);

    const content = this.content();
    const portal = isString(content) ? new DomPortal(content) : new TemplatePortal(content, this._viewContainerRef);
    this._dropdownOverlay.attach(portal);
  }
  private _destroyOverlay(): void {
    if (!this._dropdownOverlay) return;

    this._dropdownOverlay.dispose();
    delete this._dropdownOverlay;
  }

  private readonly _connectedPositions = computed<ConnectedPosition[]>(() => {
    if (this.position() === ArdiumTooltipPosition.Top) {
      return [
        {
          originX: this.align(),
          originY: 'bottom',
          overlayX: this.align(),
          overlayY: 'top',
        },
        {
          originX: this.align(),
          originY: 'top',
          overlayX: this.align(),
          overlayY: 'bottom',
        },
      ];
    }
    if (this.position() === ArdiumTooltipPosition.Bottom) {
      return [
        {
          originX: this.align(),
          originY: 'top',
          overlayX: this.align(),
          overlayY: 'bottom',
        },
        {
          originX: this.align(),
          originY: 'bottom',
          overlayX: this.align(),
          overlayY: 'top',
        },
      ];
    }
    if (this.position() === ArdiumTooltipPosition.Left) {
      return [
        {
          originX: 'start',
          originY:
            this.align() === ArdiumTooltipAlign.Start ? 'bottom' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'top',
          overlayX: 'end',
          overlayY:
            this.align() === ArdiumTooltipAlign.Start ? 'top' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'bottom',
        },
        {
          originX: 'end',
          originY:
            this.align() === ArdiumTooltipAlign.Start ? 'bottom' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'top',
          overlayX: 'start',
          overlayY:
            this.align() === ArdiumTooltipAlign.Start ? 'top' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'bottom',
        },
      ];
    } else {
      return [
        {
          originX: 'end',
          originY:
            this.align() === ArdiumTooltipAlign.Start ? 'bottom' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'top',
          overlayX: 'start',
          overlayY:
            this.align() === ArdiumTooltipAlign.Start ? 'top' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'bottom',
        },
        {
          originX: 'start',
          originY:
            this.align() === ArdiumTooltipAlign.Start ? 'bottom' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'top',
          overlayX: 'end',
          overlayY:
            this.align() === ArdiumTooltipAlign.Start ? 'top' : this.align() === ArdiumTooltipAlign.Center ? 'center' : 'bottom',
        },
      ];
    }
  });

  private _showTimeout?: NodeJS.Timeout;
  private _hideTimeout?: NodeJS.Timeout;

  public show(): void {
    if (this.disabled()) return;
    if (this._dropdownOverlay) return;

    this._clearShowTimeout();
    this._clearHideTimeout();

    this._showTimeout = setTimeout(() => {
      this._createOverlay();
    }, this.showDelay());
  }
  public hide(): void {
    if (!this._dropdownOverlay) return;

    this._clearShowTimeout();

    if (this._hideTimeout) return;

    this._hideTimeout = setTimeout(() => {
      this._dropdownOverlay?.addPanelClass('ard-tooltip__hiding');

      setTimeout(() => {
        this._destroyOverlay();
      }, 150);
    }, this.hideDelay());
  }
  public toggle(): void {
    if (this._dropdownOverlay) {
      this.hide();
    } else {
      this.show();
    }
  }

  private _clearShowTimeout(): void {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
      this._showTimeout = undefined;
    }
  }
  private _clearHideTimeout(): void {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = undefined;
    }
  }

  @HostListener('mouseenter')
  protected _onMouseEnter(): void {
    this.show();
  }
  @HostListener('mouseleave')
  protected _onMouseLeave(): void {
    this.hide();
  }
  @HostListener('focus')
  protected _onFocus(): void {
    this.show();
  }
  @HostListener('blur')
  protected _onBlur(): void {
    this.hide();
  }

  ngOnDestroy(): void {
    this._destroyOverlay();
  }
}
