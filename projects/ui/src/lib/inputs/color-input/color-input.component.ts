import {
    Overlay,
    OverlayConfig,
    OverlayRef,
    ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import * as Color from 'color';
import { ButtonVariant } from '../../buttons/general-button.types';
import { CardAppearance, CardVariant } from '../../card/card.types';
import {
    DropdownPanelAppearance,
    DropdownPanelVariant,
} from '../../dropdown-panel/dropdown-panel.types';
import {
    FormElementAppearance,
    FormElementVariant,
} from '../../types/theming.types';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { CaseTransformerType } from '../input-types';
import {
    ArdColorInputActionButtonsTemplateDirective,
    ArdColorInputColorReferenceTemplateDirective,
    ArdColorInputHueIndicatorTemplateDirective,
    ArdColorInputOpacityIndicatorTemplateDirective,
    ArdColorInputPlaceholderTemplateDirective,
    ArdColorInputPrefixTemplateDirective,
    ArdColorInputShadeIndicatorTemplateDirective,
    ArdColorInputSuffixTemplateDirective,
} from './color-input.directives';
import { ColorInputActionButtonsContext } from './color-input.types';

@Component({
    selector: 'ard-color-input',
    templateUrl: './color-input.component.html',
    styleUrls: ['./color-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumColorInputComponent),
            multi: true,
        },
    ],
})
export class ArdiumColorInputComponent
    extends _NgModelComponentBase
    implements ControlValueAccessor, AfterViewInit
{
    readonly element!: HTMLElement;

    constructor(
        private _cd: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay,
        private scrollStrategyOpts: ScrollStrategyOptions,
        elementRef: ElementRef<HTMLElement>,
    ) {
        super();

        this.element = elementRef.nativeElement;
    }
    //! ChangeDetectorRef
    detectChanges(): void {
        if (!(<any>this._cd).destroyed) {
            this._cd.detectChanges();
        }
    }

    //! input view
    @ViewChild('textInput')
    protected textInputEl!: ElementRef<HTMLInputElement>;
    ngAfterViewInit(): void {
        this._setInputAttributes();
    }

    readonly DEFAULTS = {
        clearButtonTitle: 'Clear',
    };

    @Input() inputId?: string;

    //! prefix & suffix
    @ContentChild(ArdColorInputPrefixTemplateDirective, { read: TemplateRef })
    prefixTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorInputSuffixTemplateDirective, { read: TemplateRef })
    suffixTemplate?: TemplateRef<any>;

    //! placeholder
    @Input() placeholder: string = '';

    @ContentChild(ArdColorInputPlaceholderTemplateDirective, {
        read: TemplateRef,
    })
    placeholderTemplate?: TemplateRef<any>;

    get shouldDisplayPlaceholder(): boolean {
        return Boolean(this.placeholder) && !this.value;
    }

    //! appearance
    //all handled in ard-form-field-frame component
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean {
        return this._compact;
    }
    set compact(v: any) {
        this._compact = coerceBooleanProperty(v);
    }

    //! settings
    @Input() case: CaseTransformerType = CaseTransformerType.NoChange;

    private _withActionButtons: boolean = false;
    @Input()
    get withActionButtons(): boolean {
        return this._withActionButtons;
    }
    set withActionButtons(v: any) {
        this._withActionButtons = coerceBooleanProperty(v);
    }

    //! clear button
    private _clearable: boolean = true;
    @Input()
    get clearable(): boolean {
        return this._clearable;
    }
    set clearable(v: any) {
        this._clearable = coerceBooleanProperty(v);
        if (this.value == null) {
            this.value = Color('red');
        }
    }

    @Input() clearButtonTitle: string = this.DEFAULTS.clearButtonTitle;

    get shouldShowClearButton(): boolean {
        return this._clearable && !this.disabled && Boolean(this.value);
    }
    onClearButtonClick(event: MouseEvent): void {
        event.stopPropagation();
        this.clear();
        this.focus();
    }

    //! other inputs
    @Input() inputAttrs: { [key: string]: any } = {};

    //! control value accessor's write value implementation
    writeValue(v: Color | null) {
        this.value = v;
    }

    //! clear function
    clear(): void {
        if (!this.clearable) return;

        this.writeValue(null);
        this._emitChange();
        this.clearEvent.emit();
    }

    //! value two-way binding
    protected _value: Color | null = null;
    @Input()
    set value(v: Color | null) {
        this._value = v;
        this._updateInputElValue();
    }
    get value(): Color | null {
        return this._value;
    }
    @Output() valueChange = new EventEmitter<Color>();

    //* event emitters
    @Output('change') changeEvent = new EventEmitter<Color>();
    @Output('clear') clearEvent = new EventEmitter<any>();

    //! event handlers
    //change
    onChange(event: Event): void {
        event.stopPropagation();
        this._emitChange();
    }
    protected _emitChange(): void {
        const v = this.value;
        if (!v) return;

        this._onChangeRegistered?.(v);
        this.changeEvent.emit(v);
        this.valueChange.emit(v);
    }
    private _onTouched(): void {
        this.touched = true;
        this._onTouchedRegistered?.();
    }

    //smart focus
    onMouseup(): void {
        this.toggle();
    }

    onCopy(event: ClipboardEvent): void {
        const v = this.value;
        if (!v) return;

        event.clipboardData?.setData('text/plain', v.hex().toString());
        event.preventDefault();
    }

    //! state
    private _touched: boolean = false;
    get touched(): boolean {
        return this._touched;
    }
    private set touched(state: boolean) {
        this._touched = state;
    }

    //! color picker overlay
    @ViewChild('overlayHost', { read: ElementRef })
    overlayHost!: ElementRef<HTMLDivElement>;
    @ViewChild('overlayTemplate', { read: TemplateRef })
    overlayTemplate!: TemplateRef<any>;

    private overlayRef?: OverlayRef;

    private _createOverlay(): void {
        const strategy = this.overlay
            .position()
            .flexibleConnectedTo(this.overlayHost)
            .withPositions([
                {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'top',
                },
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'top',
                },
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'bottom',
                },
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'bottom',
                },
            ]);

        const config = new OverlayConfig({
            positionStrategy: strategy,
            scrollStrategy: this.scrollStrategyOpts.block(),
            hasBackdrop: false,
        });

        this.overlayRef = this.overlay.create(config);

        const portal = new TemplatePortal(
            this.overlayTemplate,
            this.viewContainerRef,
        );
        this.overlayRef.attach(portal);
    }
    private _destroyOverlay(): void {
        if (!this.overlayRef) return;

        this.overlayRef.dispose();
        delete this.overlayRef;
    }

    //! overlay state handlers
    private _isOverlayOpen: boolean = false;

    @Output('open') openEvent = new EventEmitter<any>();
    @Output('close') closeEvent = new EventEmitter<any>();

    toggle(): void {
        if (this._isOverlayOpen) {
            this.close();
            return;
        }
        this.open();
    }
    open(): void {
        if (this.disabled || this._isOverlayOpen) return;

        this._isOverlayOpen = true;

        this._createOverlay();
        this.focus();

        this.openEvent.emit();
    }
    close(): void {
        if (!this._isOverlayOpen) return;

        this._isOverlayOpen = false;
        this._temporaryValue = null;

        this._destroyOverlay();

        this._onTouched();
        this.closeEvent.emit();
    }
    //! overlay appearance
    private _overlayAppearance?: CardAppearance = undefined;
    @Input()
    set overlayAppearance(v: CardAppearance) {
        this._overlayAppearance = v;
    }
    get overlayAppearance(): CardAppearance {
        if (this._overlayAppearance) return this._overlayAppearance;
        if (this.appearance == FormElementAppearance.Outlined)
            return DropdownPanelAppearance.Outlined;
        return DropdownPanelAppearance.Raised;
    }
    private _overlayVariant?: CardVariant = undefined;
    @Input()
    set overlayVariant(v: CardVariant) {
        this._overlayVariant = v;
    }
    get overlayVariant(): CardVariant {
        if (this._overlayVariant) return this._overlayVariant;
        if (this.variant == FormElementVariant.Pill)
            return DropdownPanelVariant.Rounded;
        return this.variant;
    }

    //! color picker integration
    private _temporaryValue: Color | null = null;
    onColorPickerChange(event: Color): void {
        if (this.withActionButtons) {
            this._temporaryValue = event;
            return;
        }
        this.value = event;
        this.detectChanges();
    }
    handleOutsideClick(event: MouseEvent): void {
        if (!this._isOverlayOpen) return;
        const target = event.target as HTMLElement;
        if (this.element.contains(target)) return;

        this.close();
    }
    apply(): void {
        if (!this._temporaryValue) return this.cancel();

        this.value = this._temporaryValue;
        this.detectChanges();
        this.close();
    }
    cancel(): void {
        this.close();
    }
    reset(): void {
        this._temporaryValue = this.value;
    }

    //! overlay templates
    @ContentChild(ArdColorInputShadeIndicatorTemplateDirective, {
        read: TemplateRef,
    })
    shadeIndicatorTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorInputHueIndicatorTemplateDirective, {
        read: TemplateRef,
    })
    hueIndicatorTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorInputOpacityIndicatorTemplateDirective, {
        read: TemplateRef,
    })
    opacityIndicatorTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorInputColorReferenceTemplateDirective, {
        read: TemplateRef,
    })
    colorReferenceTemplate?: TemplateRef<any>;
    @ContentChild(ArdColorInputActionButtonsTemplateDirective, {
        read: TemplateRef,
    })
    actionButtonsTemplate?: TemplateRef<any>;

    get actionButtonVariant(): ButtonVariant {
        if (this.variant == FormElementVariant.Sharp)
            return ButtonVariant.Sharp;
        return ButtonVariant.Rounded;
    }
    getActionButtonsContext(): ColorInputActionButtonsContext {
        return {
            apply: () => {
                this.apply();
            },
            cancel: () => {
                this.cancel();
            },
            reset: () => {
                this.reset();
            },
        };
    }

    //! helpers
    protected _updateInputElValue(): void {
        this.textInputEl.nativeElement.value =
            this.value?.hex().toString() ?? '';
    }
    protected _setInputAttributes() {
        const input = this.textInputEl.nativeElement;
        const attributes: { [key: string]: string } = {
            type: 'text',
            autocorrect: 'off',
            autocapitalize: 'off',
            autocomplete: 'off',
            tabindex: String(this.tabIndex),
            ...this.inputAttrs,
        };

        for (const key of Object.keys(attributes)) {
            input.setAttribute(key, String(attributes[key]));
        }
    }
}
