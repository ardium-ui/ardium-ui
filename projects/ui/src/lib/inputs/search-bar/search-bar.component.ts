import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, ContentChild, TemplateRef, ViewChild, ElementRef, Input, HostBinding, Output, EventEmitter, signal, ViewContainerRef, HostListener } from '@angular/core';
import { ArdiumSimpleInputComponent } from '../simple-input/simple-input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArdDropdownFooterTemplateDirective, ArdDropdownHeaderTemplateDirective, ArdSearchBarPlaceholderTemplateDirective, ArdSearchBarPrefixTemplateDirective, ArdSearchBarSuffixTemplateDirective } from './search-bar.directives';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { SimpleInputModel, SimpleInputModelHost } from '../input-utils';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel/dropdown-panel.types';
import { ArdiumDropdownPanelComponent } from '../../dropdown-panel/dropdown-panel.component';
import { Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isAnyString } from 'simple-bool';

@Component({
    selector: 'ard-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumSimpleInputComponent),
            multi: true
        }
    ]
})
export class ArdiumSearchBarComponent extends _NgModelComponentBase implements SimpleInputModelHost {

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private scrollStrategyOpts: ScrollStrategyOptions,
    ) {
        super();
    }

    //needed to implement the model
    readonly maxLength?: number | undefined;

    readonly DEFAULTS = {
        clearButtonTitle: 'Clear',
    }
    //! input view
    @ViewChild('textInput', { static: true }) textInputEl!: ElementRef<HTMLInputElement>;
    protected inputModel!: SimpleInputModel;
    ngOnInit(): void {
        this.inputModel = new SimpleInputModel(this.textInputEl.nativeElement, this);
        this._setInputAttributes();
        //set the value
        if (this._valueBeforeInit) {
            this.writeValue(this._valueBeforeInit);
            delete this._valueBeforeInit;
        }
    }

    @Input() placeholder: string = '';
    @Input() inputId: string = crypto.randomUUID();
    @Input() clearButtonTitle: string = this.DEFAULTS.clearButtonTitle;

    //! prefix & suffix
    @ContentChild(ArdSearchBarPrefixTemplateDirective, { read: TemplateRef }) prefixTemplate?: TemplateRef<any>;
    @ContentChild(ArdSearchBarSuffixTemplateDirective, { read: TemplateRef }) suffixTemplate?: TemplateRef<any>;

    //! placeholder
    @ContentChild(ArdSearchBarPlaceholderTemplateDirective, { read: TemplateRef })
    placeholderTemplate?: TemplateRef<any>;

    get shouldDisplayPlaceholder(): boolean { return Boolean(this.placeholder) && !this.value };

    //! appearance
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;
    @Input() alignText: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Left;
    @Input() alignIcon: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Right;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            `ard-text-align-${this.alignText}`,
            this._isDropdownOpen ? 'ard-dropdown-open' : '',
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }

    //! other inputs
    @Input() inputAttrs: { [key: string]: any } = {};

    //! no-value attribute setters/getters
    protected _clearable: boolean = true;
    @Input()
    @HostBinding('class.ard-clearable')
    get clearable(): boolean { return this._clearable; };
    set clearable(v: any) { this._clearable = coerceBooleanProperty(v); }

    //! control value accessor's write value implementation
    writeValue(v: any) {
        this.inputModel.writeValue(v);
    }
    //! value two-way binding
    protected _valueBeforeInit?: string | null = null;
    @Input()
    set value(v: string | null) {
        if (!this.inputModel) {
            this._valueBeforeInit = v;
            return;
        }
        this.writeValue(v);
    }
    get value(): string | null { return this.inputModel.value; }
    @Output() valueChange = new EventEmitter<string | null>();

    //! event emitters
    @Output('input') inputEvent = new EventEmitter<string | null>();
    @Output('change') changeEvent = new EventEmitter<string | null>();
    @Output('clear') clearEvent = new EventEmitter<MouseEvent>();

    //! event handlers
    onInput(newVal: string): void {
        let valueHasChanged = this.inputModel.writeValue(newVal);
        if (!valueHasChanged) return;
        this._emitInput();
    }
    protected _emitInput(): void {
        this._onChangeRegistered?.(this.value);
        this.inputEvent.emit(this.value);
        this.valueChange.emit(this.value);
    }
    //! focus, blur, change
    onFocusMaster(event: FocusEvent): void {
        this.onFocus(event);
    }
    onBlurMaster(event: FocusEvent): void {
        this.onBlur(event);
    }
    onChange(event: Event): void {
        event.stopPropagation();
        this._emitChange();
    }
    protected _emitChange(): void {
        this.changeEvent.emit(this.inputModel.value);
    }
    //!  clear button
    get shouldShowClearButton(): boolean {
        return this._clearable && !this.disabled && Boolean(this.inputModel.value);
    }
    onClearButtonClick(event: MouseEvent): void {
        event.stopPropagation();
        this.inputModel.clear();
        this._emitChange();
        this._emitInput();
        this.clearEvent.emit(event);
        this.focus();
    }

    //! copy
    onCopy(event: ClipboardEvent): void {
        if (
            this.value &&
            (
                //does the selection cover the entire input
                this.textInputEl.nativeElement.selectionStart == 0
                && this.textInputEl.nativeElement.selectionEnd == this.textInputEl.nativeElement.value.length
                //or is zero-wide
                || this.textInputEl.nativeElement.selectionStart == this.textInputEl.nativeElement.selectionEnd
            )
        ) {
            event.clipboardData?.setData("text/plain", this.value);
            event.preventDefault();
        }
    }

    //! search suggestions
    private _suggestions: undefined | { value: string, bold?: boolean; }[][] = undefined;
    @Input() set suggestions(v: undefined | string[] | { value: string, bold?: boolean; }[][]) {
        if (v && isAnyString(v[1])) {
            v = v.map((el => [{ value: el as string }]));
        }
        this._suggestions = v as undefined | { value: string, bold?: boolean; }[][];
    }
    get suggestions() {
        return this._suggestions;
    }

    //! dropdown
    private _isDropdownOpen = false;

    @ViewChild(forwardRef(() => ArdiumDropdownPanelComponent)) dropdownPanel!: ArdiumDropdownPanelComponent;

    private _dropdownAppearance?: DropdownPanelAppearance = undefined;
    @Input()
    set dropdowonAppearance(v: DropdownPanelAppearance) {
        this._dropdownAppearance = v;
    }
    get dropdownAppearance(): DropdownPanelAppearance {
        if (this._dropdownAppearance) return this._dropdownAppearance;
        if (this.appearance == FormElementAppearance.Outlined) return DropdownPanelAppearance.Outlined;
        return DropdownPanelAppearance.Raised;
    }
    private _dropdownVariant?: DropdownPanelVariant = undefined;
    @Input()
    set dropdowonVariant(v: DropdownPanelVariant) {
        this._dropdownVariant = v;
    }
    get dropdownVariant(): DropdownPanelVariant {
        if (this._dropdownVariant) return this._dropdownVariant;
        if (this.variant == FormElementVariant.Pill) return DropdownPanelVariant.Rounded;
        return this.variant;
    }

    @ContentChild(ArdDropdownHeaderTemplateDirective, { read: TemplateRef }) dropdownHeaderTemplate?: TemplateRef<any>;
    @ContentChild(ArdDropdownFooterTemplateDirective, { read: TemplateRef }) dropdownFooterTemplate?: TemplateRef<any>;

    //! dropdown overlay
    @ViewChild('dropdownHost', { read: ElementRef }) dropdownHost!: ElementRef<HTMLDivElement>;
    @ViewChild('dropdownTemplate', { read: TemplateRef }) dropdownTemplate!: TemplateRef<any>;

    private dropdownOverlay?: OverlayRef;

    private _createOverlay(): void {
        const strategy = this.overlay.position()
            .flexibleConnectedTo(this.dropdownHost)
            .withPositions([{
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
            }, {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
            }]);

        const config = new OverlayConfig({
            positionStrategy: strategy,
            scrollStrategy: this.scrollStrategyOpts.block(),
            hasBackdrop: false,
        });

        this.dropdownOverlay = this.overlay.create(config);

        const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
        this.dropdownOverlay.attach(portal);
        this.setOverlaySize();
    }
    private _destroyOverlay(): void {
        if (!this.dropdownOverlay) return;

        this.dropdownOverlay.dispose();
        delete this.dropdownOverlay;
    }

    setOverlaySize(): void {
        if (!this.dropdownOverlay) return;

        const rect = this.dropdownHost.nativeElement.getBoundingClientRect();
        this.dropdownOverlay.updateSize({ width: rect.width });
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.setOverlaySize();
    }

    //! helpers
    protected _setInputAttributes() {
        const input = this.textInputEl.nativeElement;
        const attributes: { [key: string]: string } = {
            type: 'text',
            autocorrect: 'off',
            autocapitalize: 'off',
            autocomplete: 'off',
            tabindex: String(this.tabIndex),
            ...this.inputAttrs
        };

        for (const key of Object.keys(attributes)) {
            input.setAttribute(key, String(attributes[key]));
        }
    }
}
