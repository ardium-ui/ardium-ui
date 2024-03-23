import {
    ConnectedPosition,
    Overlay,
    OverlayConfig,
    OverlayRef,
    ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceArrayProperty, coerceBooleanProperty } from '@ardium-ui/devkit';
import { isString } from 'simple-bool';
import {
    DropdownPanelAppearance,
    DropdownPanelVariant,
} from '../../dropdown-panel/dropdown-panel.types';
import { ArdSimplestStorageItem } from '../../types/item-storage.types';
import {
    FormElementAppearance,
    FormElementVariant,
} from '../../types/theming.types';
import {
    SimplestItemStorage,
    SimplestItemStorageHost,
} from '../../_internal/item-storages/simplest-item-storage';
import { ArdiumSimpleInputComponent } from '../simple-input/simple-input.component';
import { OptionContext } from './../../types/item-storage.types';
import {
    escapeAndCreateRegex,
    InputModel,
    InputModelHost,
} from './../input-utils';
import {
    ArdInputLoadingTemplateDirective,
    ArdInputPlaceholderTemplateDirective,
    ArdInputPrefixTemplateDirective,
    ArdInputSuffixTemplateDirective,
    ArdSuggestionTemplateDirective,
} from './input.directives';

@Component({
    selector: 'ard-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumInputComponent),
            multi: true,
        },
    ],
})
export class ArdiumInputComponent
    extends ArdiumSimpleInputComponent
    implements InputModelHost, OnInit, SimplestItemStorageHost, AfterViewInit
{
    private readonly element!: HTMLElement;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay,
        private scrollStrategyOpts: ScrollStrategyOptions,
    ) {
        super();

        this.element = viewContainerRef.element.nativeElement;
    }

    override readonly DEFAULTS = {
        clearButtonTitle: 'Clear',
        valueFrom: 'value',
        labelFrom: 'label',
        suggestionsLoadingText: 'Loading...',
    };
    //! input view
    protected override inputModel!: InputModel;
    override ngOnInit(): void {
        this.inputModel = new InputModel(this.textInputEl.nativeElement, this);
        this._setInputAttributes();
        //set the value
        if (this._valueBeforeInit) {
            this.writeValue(this._valueBeforeInit);
            delete this._valueBeforeInit;
        }
    }

    //! allowlist/denylist of characters
    //use standard string for denylist, prepend with ^ for allowlist
    private _charlistRegExp?: RegExp;
    @Input()
    get charlist(): RegExp | undefined {
        return this._charlistRegExp;
    }
    set charlist(v: any) {
        if (!isString(v)) {
            throw new Error('charlistRegExp must be a non-empty string.');
        }
        let flags = this._charlistCaseInsensitive ? 'i' : '';
        let negated = v.startsWith('^');
        this._charlistRegExp = escapeAndCreateRegex(v, flags, !negated);
    }
    protected _charlistCaseInsensitive: boolean = false;
    @Input()
    get charlistCaseInsensitive(): boolean {
        return this._charlistCaseInsensitive;
    }
    set charlistCaseInsensitive(v: any) {
        this._charlistCaseInsensitive = coerceBooleanProperty(v);
        if (this._charlistRegExp) {
            let flags = this._charlistCaseInsensitive ? 'i' : '';
            this._charlistRegExp = new RegExp(
                this._charlistRegExp.source,
                flags,
            );
        }
    }

    //! autocomplete
    protected _autocomplete?: string | null;
    @Input()
    set autocomplete(v: string | null | undefined) {
        this._autocomplete = v;
    }
    get autocomplete(): string | null | undefined {
        return this._autocomplete ?? '';
    }
    //should show autocomplete
    get shouldDisplayAutocomplete(): boolean {
        return !this.disabled && Boolean(this.autocomplete);
    }
    //autocomplete event
    @Output('acceptAutocomplete') acceptAutocompleteEvent = new EventEmitter();

    //! prefix & suffix
    @ContentChild(ArdInputPrefixTemplateDirective, { read: TemplateRef })
    override prefixTemplate?: TemplateRef<any>;
    @ContentChild(ArdInputSuffixTemplateDirective, { read: TemplateRef })
    override suffixTemplate?: TemplateRef<any>;

    //! placeholder
    @ContentChild(ArdInputPlaceholderTemplateDirective, { read: TemplateRef })
    override placeholderTemplate?: TemplateRef<any>;

    //! suggestions
    suggestionStorage = new SimplestItemStorage(this);

    @Input('suggValueFrom') valueFrom?: string;
    @Input('suggLabelFrom') labelFrom?: string;

    @Output('acceptSuggestion') acceptSuggestionEvent = new EventEmitter<any>();

    get suggestionItems(): any[] {
        return this.suggestionStorage.items;
    }
    @Input()
    set suggestions(value: any) {
        if (!Array.isArray(value)) value = coerceArrayProperty(value);

        let shouldPrintErrors = this.suggestionStorage.setItems(value);

        this._suggestionDropdowOpen = true;
        this.suggestionStorage.highlightFirstItem();

        if (shouldPrintErrors) {
            this._printPrimitiveWarnings();
        }
    }
    private _printPrimitiveWarnings() {
        function makeWarning(str: string): void {
            console.warn(
                `Skipped using [${str}] property bound to <ard-input>, as some provided suggestion items are of primitive type`,
            );
        }
        if (this.valueFrom) {
            makeWarning('valueFrom');
        }
        if (this.labelFrom) {
            makeWarning('labelFrom');
        }
    }

    private _suggestionDropdowOpen: boolean = false;

    get shouldDisplaySuggestions(): boolean {
        return (
            !this.disabled &&
            (this.suggestionItems.length > 0 || this.areSuggestionsLoading) &&
            this._suggestionDropdowOpen
        );
    }

    @Input() areSuggestionsLoading: boolean = false;
    @Input() suggestionsLoadingText: string =
        this.DEFAULTS.suggestionsLoadingText;

    @ContentChild(ArdSuggestionTemplateDirective, { read: TemplateRef })
    suggestionTemplate?: TemplateRef<any>;
    @ContentChild(ArdInputLoadingTemplateDirective, { read: TemplateRef })
    suggestionLoadingTemplate?: TemplateRef<any>;

    //! suggestions overlay
    @ViewChild('suggestionsHost', { read: ElementRef })
    dropdownHost!: ElementRef<HTMLDivElement>;
    @ViewChild('suggestionsTemplate', { read: TemplateRef })
    dropdownTemplate!: TemplateRef<any>;

    private dropdownOverlay!: OverlayRef;

    ngAfterViewInit(): void {
        const strategy = this.overlay
            .position()
            .flexibleConnectedTo(this.dropdownHost)
            .withPositions([
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                } as ConnectedPosition,
            ])
            .withPush(false);

        const config = new OverlayConfig({
            positionStrategy: strategy,
            scrollStrategy: this.scrollStrategyOpts.block(),
            hasBackdrop: false,
        });

        this.dropdownOverlay = this.overlay.create(config);

        this.dropdownOverlay;

        const portal = new TemplatePortal(
            this.dropdownTemplate,
            this.viewContainerRef,
        );
        this.dropdownOverlay.attach(portal);

        this.setOverlaySize();
    }

    setOverlaySize(): void {
        const rect = this.dropdownHost.nativeElement.getBoundingClientRect();
        this.dropdownOverlay.updateSize({ width: rect.width });
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.setOverlaySize();
    }

    getOptionContext(item: ArdSimplestStorageItem): OptionContext {
        return {
            $implicit: item,
            item,
            itemData: item.itemData,
        };
    }

    //! suggestion-highligh-related
    private _isMouseBeingUsed: boolean = false;
    @HostListener('mousemove')
    onMouseMove() {
        this._isMouseBeingUsed = true;
    }
    onSuggestionMouseEnter(
        item: ArdSimplestStorageItem,
        event: MouseEvent,
    ): void {
        if (!this._isMouseBeingUsed) return;
        this.suggestionStorage.highlightItem(item);

        event.stopPropagation();
    }
    onSuggestionMouseLeave(
        item: ArdSimplestStorageItem,
        event: MouseEvent,
    ): void {
        if (!this._isMouseBeingUsed) return;
        this.suggestionStorage.unhighlightItem(item);

        event.stopPropagation();
    }

    //! suggestion selection
    selectSuggestion(item: ArdSimplestStorageItem, event: MouseEvent): void {
        event.stopPropagation();

        this._selectSuggestion(item);
    }
    private _selectSuggestion(item: ArdSimplestStorageItem): void {
        const selected = this.suggestionStorage.selectItem(item);
        this.writeValue(selected ?? '');

        this.acceptSuggestionEvent.next(selected);

        //important to do those two things in this exact order
        this.focus();
        this._suggestionDropdowOpen = false;
    }
    handleSuggestionClickOutside(event: MouseEvent): void {
        if (!this.shouldDisplaySuggestions) return;

        const target = event.target as HTMLElement;
        if (this.element.contains(target)) return;

        this._suggestionDropdowOpen = false;
    }
    //! suggestion appearance
    private _dropdownAppearance?: DropdownPanelAppearance = undefined;
    @Input()
    set dropdowonAppearance(v: DropdownPanelAppearance) {
        this._dropdownAppearance = v;
    }
    get dropdownAppearance(): DropdownPanelAppearance {
        if (this._dropdownAppearance) return this._dropdownAppearance;
        if (this.appearance == FormElementAppearance.Outlined)
            return DropdownPanelAppearance.Outlined;
        return DropdownPanelAppearance.Raised;
    }
    private _dropdownVariant?: DropdownPanelVariant = undefined;
    @Input()
    set dropdowonVariant(v: DropdownPanelVariant) {
        this._dropdownVariant = v;
    }
    get dropdownVariant(): DropdownPanelVariant {
        if (this._dropdownVariant) return this._dropdownVariant;
        if (this.variant == FormElementVariant.Pill)
            return DropdownPanelVariant.Rounded;
        return this.variant;
    }

    //! focus override
    override onFocus(event: FocusEvent): void {
        this._suggestionDropdowOpen = true;
        if (!this.suggestionStorage.highlightedItem)
            this.suggestionStorage.highlightFirstItem();

        super.onFocus(event);
    }

    //! key press handlers
    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Enter': {
                this._onTabOrEnterPress(event);
                this._onEnterPress(event);
                return;
            }
            case 'Tab': {
                this._onTabOrEnterPress(event);
                return;
            }
            case 'ArrowDown': {
                this._onArrowDownPress(event);
                return;
            }
            case 'ArrowUp': {
                this._onArrowUpPress(event);
                return;
            }
        }
    }
    protected _onTabOrEnterPress(event: KeyboardEvent): void {
        if (!this.shouldDisplayAutocomplete) return;
        event.preventDefault();

        this.onInput(this.autocomplete ?? '');
        this.acceptAutocompleteEvent.emit();
    }
    private _onEnterPress(event: KeyboardEvent): void {
        if (!this.shouldDisplaySuggestions) return;
        if (!this.suggestionStorage.highlightedItem) return;

        event.preventDefault();
        this._selectSuggestion(this.suggestionStorage.highlightedItem);
    }
    private _onArrowDownPress(event: KeyboardEvent): void {
        if (!this.shouldDisplaySuggestions) return;
        event.preventDefault();

        this._isMouseBeingUsed = false;

        this.suggestionStorage.highlightNextItem(+1);
    }
    private _onArrowUpPress(event: KeyboardEvent): void {
        if (!this.shouldDisplaySuggestions) return;
        event.preventDefault();

        this._isMouseBeingUsed = false;

        this.suggestionStorage.highlightNextItem(-1);
    }
}
