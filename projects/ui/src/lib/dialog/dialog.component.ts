import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ButtonAppearance } from '../buttons/general-button.types';
import { ComponentColor } from '../types/colors.types';
import { PanelAppearance, PanelVariant } from '../types/theming.types';
import { ARD_DIALOG_DEFAULTS } from './dialog.defaults';
import { ArdDialogButtonsTemplateDirective, ArdDialogCloseIconTemplateDirective } from './dialog.directives';
import { ArdDialogActionType, ArdDialogResult, DialogButtonsContext } from './dialog.types';

@Component({
  selector: 'ard-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumDialogComponent {
  private readonly _DEFAULTS = inject(ARD_DIALOG_DEFAULTS);

  //! appearance
  //all handled by modal component
  readonly appearance = input<PanelAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<PanelVariant>(this._DEFAULTS.variant);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  //! heading
  //all handled by modal component
  readonly heading = input<string>(this._DEFAULTS.heading);

  readonly noCloseButton = input<boolean, any>(this._DEFAULTS.noCloseButton, { transform: v => coerceBooleanProperty(v) });

  //! options
  //all handled by modal component
  readonly noBackdrop = input<boolean, any>(this._DEFAULTS.noBackdrop, { transform: v => coerceBooleanProperty(v) });
  readonly disableBackdropClose = input<boolean, any>(this._DEFAULTS.disableBackdropClose, {
    transform: v => coerceBooleanProperty(v),
  });

  readonly buttonActionType = input<ArdDialogActionType>(this._DEFAULTS.buttonActionType);

  readonly allActionsDisabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! open state handling
  //all handled by modal component
  readonly open = model<boolean>(false);

  readonly closeEvent = output<ArdDialogResult>({ alias: 'close' });
  readonly confirmEvent = output<void>({ alias: 'confirm' });
  readonly rejectEvent = output<void>({ alias: 'reject' });

  openProgrammatically() {
    this.open.set(true);
  }
  closeProgrammatically() {
    this.open.set(false);
  }

  //! button settings
  readonly confirmButtonText = input<string>(this._DEFAULTS.confirmButtonText);
  readonly confirmButtonColor = input<ComponentColor>(this._DEFAULTS.confirmButtonColor);
  readonly confirmButtonAppearance = input<ButtonAppearance>(this._DEFAULTS.confirmButtonAppearance);
  readonly rejectButtonText = input<string>(this._DEFAULTS.rejectButtonText);
  readonly rejectButtonColor = input<ComponentColor>(this._DEFAULTS.rejectButtonColor);
  readonly rejectButtonAppearance = input<ButtonAppearance>(this._DEFAULTS.rejectButtonAppearance);

  readonly noRejectButton = input<boolean, any>(this._DEFAULTS.noRejectButton, { transform: v => coerceBooleanProperty(v) });
  readonly canConfirm = input<boolean, any>(this._DEFAULTS.canConfirm, { transform: v => coerceBooleanProperty(v) });

  onConfirmClick() {
    if (!this.canConfirm() || this.allActionsDisabled()) return;

    if (this.buttonActionType() === ArdDialogActionType.AutoClose) {
      this.open.set(false);
    }
    setTimeout(() => {
      this.confirmEvent.emit();
      this.closeEvent.emit('confirm');
    }, 0);
  }
  onRejectClick() {
    if (this.allActionsDisabled()) return;

    if (this.buttonActionType() === ArdDialogActionType.AutoClose) {
      this.open.set(false);
    }
    setTimeout(() => {
      this.rejectEvent.emit();
      this.closeEvent.emit('reject');
    }, 0);
  }
  onModalClose() {
    this.closeEvent.emit('close');
  }

  //! templates
  readonly buttonsTemplate = contentChild(ArdDialogButtonsTemplateDirective);

  readonly closeIconTemplate = contentChild(ArdDialogCloseIconTemplateDirective);

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
      allActionsDisabled: this.allActionsDisabled(),
      onConfirm: () => this.onConfirmClick(),
      onReject: () => this.onRejectClick(),
      dialogAppearance: this.appearance(),
      dialogVariant: this.variant(),
      dialogCompact: this.compact(),
    };
  });
}
