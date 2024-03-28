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
  effect,
  signal,
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
  constructor(
    private overlay: Overlay,
    private scrollStrategyOpts: ScrollStrategyOptions,
    private viewContainerRef: ViewContainerRef
  ) {}

  //! appearance
  @Input() appearance: PanelAppearance = PanelAppearance.Raised;
  @Input() variant: PanelVariant = PanelVariant.Rounded;

  private _compact: boolean = false;
  @Input()
  get compact(): boolean {
    return this._compact;
  }
  set compact(v: any) {
    this._compact = coerceBooleanProperty(v);
  }

  get ngClasses(): string {
    return [`ard-appearance-${this.appearance}`, `ard-variant-${this.variant}`, this.compact ? 'ard-compact' : ''].join(' ');
  }

  //! heading
  @Input() heading?: string;

  readonly noCloseButton = signal<boolean>(false);
  @Input('noCloseButton')
  set _noCloseButton(v: any) {
    this.noCloseButton.set(coerceBooleanProperty(v));
  }

  //! options
  readonly noBackdrop = signal<boolean>(false);
  @Input('noBackdrop')
  set _noBackdrop(v: any) {
    this.noBackdrop.set(coerceBooleanProperty(v));
  }

  readonly disableBackdropClose = signal<boolean>(false);
  @Input('disableBackdropClose')
  set _disableBackdropClose(v: any) {
    this.disableBackdropClose.set(coerceBooleanProperty(v));
  }

  //! open state handling
  private _open: boolean = false;
  @Input()
  get open(): boolean {
    return this._open;
  }
  set open(v: any) {
    this._open = coerceBooleanProperty(v);
    if (this._open) this._openOverlay();
    else this._destroyOverlay();
  }

  @Output() openChange = new EventEmitter<boolean>();
  @Output('close') closeEvent = new EventEmitter<null>();

  //! overlay handling
  @ViewChild('modalTemplate', { read: TemplateRef })
  modalTemplate!: TemplateRef<any>;

  private modalOverlay?: OverlayRef;

  private _openOverlay(): void {
    const strategy = this.overlay.position().global();

    const config = new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy: this.scrollStrategyOpts.block(),
      hasBackdrop: false,
    });

    this.modalOverlay = this.overlay.create(config);

    const portal = new TemplatePortal(this.modalTemplate, this.viewContainerRef);
    this.modalOverlay.attach(portal);
  }
  private _destroyOverlay(): void {
    if (!this.modalOverlay) return;

    this.openChange.emit(false);
    this.closeEvent.emit();
    this.modalOverlay.dispose();
    delete this.modalOverlay;
  }

  //! events
  onBackdropClick(event: MouseEvent): void {
    if (this.disableBackdropClose()) return;
    this._destroyOverlay();
  }
  onCloseButtonClick(event: MouseEvent): void {
    this._destroyOverlay();
  }
}
