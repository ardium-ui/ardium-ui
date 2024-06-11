import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ButtonAppearance } from '../buttons/general-button.types';
import { ComponentColor } from '../types/colors.types';
import { PanelAppearance, PanelVariant } from '../types/theming.types';
import { ArdDialogButtonsTemplateDirective } from './dialog.directives';
import { DialogButtonsContext, DialogResult } from './dialog.types';

@Component({
  selector: 'ard-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumDialogComponent {
  //! appearance
  //all handled by modal component
  readonly appearance = input<PanelAppearance>(PanelAppearance.Raised);
  readonly variant = input<PanelVariant>(PanelVariant.Rounded);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! heading
  //all handled by modal component
  readonly heading = input<string>('');

  readonly noCloseButton = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! options
  //all handled by modal component
  readonly noBackdrop = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly disableBackdropClose = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! open state handling
  //all handled by modal component  private _open: boolean = false;
  private _open = false;
  @Input()
  get open(): boolean {
    return this._open;
  }
  set open(v: any) {
    this._open = coerceBooleanProperty(v);
  }

  readonly openChange = output<boolean>();
  readonly closeEvent = output<DialogResult>({ alias: 'close' });
  readonly confirmEvent = output<void>({ alias: 'confirm' });
  readonly rejectEvent = output<void>({ alias: 'reject' });

  //! button settings
  readonly confirmButtonText = input<string>('Confirm');
  readonly confirmButtonColor = input<ComponentColor>(ComponentColor.Primary);
  readonly confirmButtonAppearance = input<ButtonAppearance>(ButtonAppearance.RaisedStrong);
  readonly rejectButtonText = input<string>('Cancel');
  readonly rejectButtonColor = input<ComponentColor>(ComponentColor.Primary);
  readonly rejectButtonAppearance = input<ButtonAppearance>(ButtonAppearance.Transparent);

  readonly noRejectButton = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly canConfirm = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  onConfirmClick() {
    if (!this.canConfirm()) return;

    this._open = false;
    setTimeout(() => {
      this.openChange.emit(false);
      this.closeEvent.emit('confirm');
      this.confirmEvent.emit();
    }, 0);
  }
  onRejectClick() {
    this._open = false;
    setTimeout(() => {
      this.openChange.emit(false);
      this.closeEvent.emit('reject');
      this.rejectEvent.emit();
    }, 0);
  }
  onModalClose() {
    this.closeEvent.emit('close');
  }

  //! templates
  @ContentChild(ArdDialogButtonsTemplateDirective)
  buttonsTemplate?: TemplateRef<DialogButtonsContext>;

  readonly getButtonsContext = computed<DialogButtonsContext>(() => {
    return {
      confirmButton: {
        text: this.confirmButtonText(),
        color: this.confirmButtonColor(),
        appearance: this.confirmButtonAppearance(),
      },
      rejectButton: {
        enabled: !this.noRejectButton(),
        text: this.rejectButtonText(),
        color: this.rejectButtonColor(),
        appearance: this.rejectButtonAppearance(),
      },
      canConfirm: this.canConfirm(),
      onConfirm: () => this.onConfirmClick(),
      onReject: () => this.onRejectClick(),
      dialogAppearance: this.appearance(),
      dialogVariant: this.variant(),
      dialogCompact: this.compact(),
    };
  });
}
