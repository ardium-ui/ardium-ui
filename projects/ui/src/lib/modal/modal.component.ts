import { Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { PanelAppearance, PanelVariant } from '../types/theming.types';

@Component({
  selector: 'ard-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumModalComponent {
  private readonly overlay = inject(Overlay);
  private readonly scrollStrategyOpts = inject(ScrollStrategyOptions);
  private readonly viewContainerRef = inject(ViewContainerRef);

  //! appearance
  readonly appearance = input<PanelAppearance>(PanelAppearance.Raised);
  readonly variant = input<PanelVariant>(PanelVariant.Rounded);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() => [`ard-variant-${this.variant()}`, `ard-appearance-${this.appearance()}`, this.compact() ? 'ard-compact' : ''].join(' '));

  //! heading
  readonly heading = input<string>('');

  readonly noCloseButton = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! options
  readonly noBackdrop = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly disableBackdropClose = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! open state handling
  private readonly open = signal<boolean>(false);
  @Input({ alias: 'open' })
  get _open(): boolean {
    return this._open;
  }
  set _open(v: any) {
    this.open.set(coerceBooleanProperty(v));
    if (this.open()) this._openOverlay();
    else this._destroyOverlay();
  }

  readonly openChange = output<boolean>();
  readonly closeEvent = output<void>({ alias: 'close' });

  //! overlay handling
  readonly modalTemplate = viewChild('modalTemplate', { read: TemplateRef });

  private _modalOverlay?: OverlayRef;

  private _openOverlay(): void {
    const strategy = this.overlay.position().global();

    const config = new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy: this.scrollStrategyOpts.block(),
      hasBackdrop: false,
    });

    this._modalOverlay = this.overlay.create(config);

    const portal = new TemplatePortal(this.modalTemplate()!, this.viewContainerRef);
    this._modalOverlay.attach(portal);
  }
  private _destroyOverlay(): void {
    if (!this._modalOverlay) return;

    this.openChange.emit(false);
    this.closeEvent.emit();
    this._modalOverlay.dispose();
    delete this._modalOverlay;
  }

  //! events
  onBackdropClick(): void {
    if (this.disableBackdropClose()) return;
    this._destroyOverlay();
  }
  onCloseButtonClick(): void {
    this._destroyOverlay();
  }
}
