import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewEncapsulation,
    signal,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { PanelAppearance, PanelVariant } from '../types/theming.types';
import { ArdDialogButtonsTemplateDirective } from './dialog.directives';
import { DialogButtonsContext, DialogResult } from './dialog.types';
import { ButtonAppearance } from '../buttons/general-button.types';

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

    //! heading
    //all handled by modal component
    @Input() heading?: string;

    readonly noCloseButton = signal<boolean>(false);
    @Input('noCloseButton')
    set _noCloseButton(v: any) {
        this.noCloseButton.set(coerceBooleanProperty(v));
    }

    //! options
    //all handled by modal component
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
    //all handled by modal component
    private _open: boolean = false;
    @Input()
    get open(): boolean {
        return this._open;
    }
    set open(v: any) {
        this._open = coerceBooleanProperty(v);
    }

    @Output() openChange = new EventEmitter<boolean>();
    @Output('close') closeEvent = new EventEmitter<DialogResult>();
    @Output('confirm') confirmEvent = new EventEmitter<null>();
    @Output('reject') rejectEvent = new EventEmitter<null>();

    //! button settings
    @Input() confirmButtonText: string = 'Confirm';
    @Input() confirmButtonColor: ComponentColor = ComponentColor.Primary;
    @Input() confirmButtonAppearance: ButtonAppearance =
        ButtonAppearance.RaisedStrong;
    @Input() rejectButtonText: string = 'Cancel';
    @Input() rejectButtonColor: ComponentColor = ComponentColor.Primary;
    @Input() rejectButtonAppearance: ButtonAppearance =
        ButtonAppearance.Transparent;

    readonly noRejectButton = signal<boolean>(false);
    @Input('noRejectButton')
    set _noRejectButton(v: any) {
        this.noRejectButton.set(coerceBooleanProperty(v));
    }

    readonly canConfirm = signal<boolean>(false);
    @Input('canConfirm')
    set _canConfirm(v: any) {
        this.canConfirm.set(coerceBooleanProperty(v));
    }

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

    getButtonsContext(): DialogButtonsContext {
        return {
            confirmButton: {
                text: this.confirmButtonText,
                color: this.confirmButtonColor,
                appearance: this.confirmButtonAppearance,
            },
            rejectButton: {
                enabled: !this.noRejectButton(),
                text: this.rejectButtonText,
                color: this.rejectButtonColor,
                appearance: this.rejectButtonAppearance,
            },
            canConfirm: this.canConfirm(),
            onConfirm: () => this.onConfirmClick(),
            onReject: () => this.onRejectClick(),
            dialogAppearance: this.appearance,
            dialogVariant: this.variant,
            dialogCompact: this.compact,
        };
    }
}
