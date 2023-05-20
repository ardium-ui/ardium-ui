import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceArrayProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { coerceBooleanProperty } from 'projects/devkit/src/public-api';
import { merge, startWith, Subject, takeUntil } from 'rxjs';
import { isAnyString, isArray, isFunction } from 'simple-bool';
import { ArdiumDropdownPanelComponent } from '../dropdown-panel/dropdown-panel.component';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../dropdown-panel/dropdown-panel.types';
import { ArdiumOptionComponent } from '../option/option.component';
import { searchFunctions } from '../search-functions';
import { ArdOption, ArdOptionGroup, ArdPanelPosition, CompareWithFn, GroupByFn, OptionContext, SearchFn } from '../types/item-storage.types';
import { FormElementAppearance } from '../types/theming.types';
import { ItemStorage } from '../_internal/item-storages/dropdown-item-storage';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { FormElementVariant } from './../types/theming.types';
import { ArdAddCustomTemplateDirective, ArdDropdownFooterTemplateDirective, ArdDropdownHeaderTemplateDirective, ArdItemDisplayLimitTemplateDirective, ArdItemLimitReachedTemplateDirective, ArdLoadingPlaceholderTemplateDirective, ArdLoadingSpinnerTemplateDirective, ArdNoItemsFoundTemplateDirective, ArdOptgroupTemplateDirective, ArdOptionTemplateDirective, ArdSelectPlaceholderTemplateDirective, ArdValueTemplateDirective } from './select.directive';
import { AddCustomFn, CustomOptionContext, GroupContext, ItemDisplayLimitContext, ItemLimitContext, PlaceholderContext, SearchContext, StatsContext, ValueContext } from './select.types';

@Component({
    selector: 'ard-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumSelectComponent),
            multi: true
        }
    ]
})
export class ArdiumSelectComponent extends _NgModelComponentBase implements OnChanges, AfterViewInit, AfterContentInit, OnInit, OnDestroy, ControlValueAccessor {

    //! public constants
    readonly itemStorage = new ItemStorage(this);
    readonly htmlId = crypto.randomUUID();
    readonly element!: HTMLElement;
    readonly DEFAULTS = {
        valueFrom: 'value',
        labelFrom: 'label',
        disabledFrom: 'disabled',
        groupLabelFrom: 'group',
        groupDisabledFrom: 'disabled',
        childrenFrom: 'children',
        searchFn: searchFunctions.byLabel,
        clearButtonTitle: 'Clear',
        noItemsFoundText: 'No items found.',
        loadingPlaceholderText: 'Loading...',
    }

    //! privates
    private _items: any[] | null = [];
    private _isMouseBeingUsed = false;
    private _searchBarFocused = false;
    private readonly _destroy$ = new Subject<void>();
    
    //! publics
    public searchTerm: string = '';
    isItemsInputUsed: boolean = false;

    //! binding-related inputs
    //value/label/disabled/group/pre-grouped children paths
    @Input() valueFrom?: string;
    @Input() labelFrom?: string;
    @Input() disabledFrom?: string;
    //! group-related inputs
    @Input() groupLabelFrom?: string | GroupByFn;
    @Input() groupDisabledFrom?: string;
    @Input() childrenFrom?: string;
    //! settings
    @Input() placeholder: string = 'Select item';
    @Input() searchPlaceholder: string = 'Search...';
    @Input() dropdownPosition: ArdPanelPosition = ArdPanelPosition.Auto;
    @Input() clearButtonTitle: string = this.DEFAULTS.clearButtonTitle;
    //! template-related settings
    @Input() noItemsFoundText: string = this.DEFAULTS.noItemsFoundText;
    @Input() loadingPlaceholderText: string = this.DEFAULTS.loadingPlaceholderText;
    //! search-related options
    @Input() searchInputId?: string;
    //! other inputs
    @Input() isLoading: boolean = false;
    @Input() inputAttrs: { [key: string]: any } = {};

    //! boolean settings
    private _itemsAlreadyGrouped: boolean = false;
    @Input()
    get itemsAlreadyGrouped(): boolean { return this._itemsAlreadyGrouped; }
    set itemsAlreadyGrouped(v: any) { this._itemsAlreadyGrouped = coerceBooleanProperty(v); }

    //should the value that the "disabledFrom" path lead to be inverted?
    //useful when the property is e.g. "active", which is the oposite of "disabled"
    private _invertDisabled: boolean = false;
    @Input()
    get invertDisabled(): boolean { return this._invertDisabled; }
    set invertDisabled(v: any) { this._invertDisabled = coerceBooleanProperty(v); }

    private _noGroupActions: boolean = false;
    @Input()
    get noGroupActions(): boolean { return this._noGroupActions; }
    set noGroupActions(v: any) { this._noGroupActions = coerceBooleanProperty(v); }

    private _autoHighlightFirst: boolean = true;
    @Input()
    get autoHighlightFirst(): boolean { return this._autoHighlightFirst; }
    set autoHighlightFirst(v: any) { this._autoHighlightFirst = coerceBooleanProperty(v); }

    private _autoFocus: boolean = false;
    @Input()
    get autoFocus(): boolean { return this._autoFocus; }
    set autoFocus(v: any) { this._autoFocus = coerceBooleanProperty(v); }

    private _keepOpen: boolean = false;
    @Input()
    get keepOpen(): boolean { return this._keepOpen; }
    set keepOpen(v: any) { this._keepOpen = coerceBooleanProperty(v); }

    private _hideSelected: boolean = false;
    @Input()
    get hideSelected(): boolean { return this._hideSelected; }
    set hideSelected(v: any) { this._hideSelected = coerceBooleanProperty(v); }
    
    private _clearOnBackspace: boolean = false;
    @Input()
    get noBackspaceClear(): boolean { return this._clearOnBackspace; }
    set noBackspaceClear(v: any) { this._clearOnBackspace = coerceBooleanProperty(v); }

    private _sortMultipleValues: boolean = false;
    @Input()
    get sortMultipleValues(): boolean { return this._sortMultipleValues; }
    set sortMultipleValues(v: any) { this._sortMultipleValues = coerceBooleanProperty(v); }

    private _searchCaseSensitive: boolean = false;
    @Input()
    get searchCaseSensitive(): boolean { return this._searchCaseSensitive; }
    set searchCaseSensitive(v: any) { this._searchCaseSensitive = coerceBooleanProperty(v); }

    private _keepSearchAfterSelect: boolean = false;
    @Input()
    get keepSearchAfterSelect(): boolean { return this._keepSearchAfterSelect; }
    set keepSearchAfterSelect(v: any) { this._keepSearchAfterSelect = coerceBooleanProperty(v); }

    //! number inputs
    private _maxSelectedItems: number | undefined = undefined;
    @Input()
    get maxSelectedItems(): number | undefined { return this._maxSelectedItems; }
    set maxSelectedItems(v: any) { this._maxSelectedItems = coerceNumberProperty(v, undefined); }

    private _itemDisplayLimit: number = Infinity;
    @Input()
    get itemDisplayLimit(): number { return this._itemDisplayLimit; }
    set itemDisplayLimit(v: any) { this._itemDisplayLimit = coerceNumberProperty(v, Infinity); }

    //! function inputs
    private _searchFn: SearchFn = this.DEFAULTS.searchFn;
    @Input()
    get searchFn(): SearchFn { return this._searchFn; }
    set searchFn(fn: SearchFn) {
        if (fn !== undefined && fn !== null && !isFunction(fn)) {
            throw Error('`searchFn` must be a function.');
        }
        this._searchFn = fn;
    }
    private _compareWith?: CompareWithFn;
    @Input()
    get compareWith(): CompareWithFn | undefined { return this._compareWith; }
    set compareWith(fn: CompareWithFn | undefined) {
        if (fn !== undefined && fn !== null && !isFunction(fn)) {
            throw Error('`compareWith` must be a function.');
        }
        this._compareWith = fn;
    }

    //! appearance
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            this.compact ? 'ard-compact' : '',
            this.multiselectable ? 'ard-multiselect' : 'ard-singleselect',
            this.clearable ? 'ard-clearable' : '',
            this.searchable ? 'ard-searchable' : '',
            this.filtered ? 'ard-filtered' : '',
            this.touched ? 'ard-touched' : '',
            this.isDropdownOpen ? 'ard-dropdown-open' : '',
            this._searchBarFocused ? 'ard-select-focused' : '',
        ].join(' ');
    }

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

    //! class-based inputs
    @Input() @HostBinding('class.ard-group-items') groupItems: boolean = false; //default value may be changed to "true" in ngOnChanges if this.groupBy is defined or this.itemsAlreadyGrouped is set to "true"

    //! items setter/getter
    @Input()
    get items() { return this._items }
    set items(value: string | any[] | null) {
        this.isItemsInputUsed = true;
        if (value === null) {
            value = [];
            this.isItemsInputUsed = false;
        }
        else if (isAnyString(value)) {
            value = coerceArrayProperty(value);
        }
        let printErrors = this.itemStorage.setItems(value);
        if (printErrors) {
            this._printPrimitiveWarnings();
        }
    };

    @ContentChildren(ArdiumOptionComponent) optionComponents!: QueryList<ArdiumOptionComponent>;

    private _setItemsFromComponents() {
        const handleOptionChange = () => {
            const changedOrDestroyed = merge(
                this.optionComponents.changes,
                this._destroy$
            );
            merge(...this.optionComponents.map(option => option.stateChange$))
                .pipe(
                    takeUntil(changedOrDestroyed)
                )
                .subscribe(option => {
                    setTimeout(() => {
                        const item = this.itemStorage.findItemByValue(option.oldValue ?? option.value);
                        if (item) {
                            item.disabled = option.disabled;
                            item.label = option.label || item.label;
                            item.value = option.value;
                            item.itemData.disabled = option.disabled;
                            item.itemData.label = option.label || item.label;
                            item.itemData.value = option.value;
                        }
                        this.detectChanges();
                    }, 0);
                });
        };
        this.optionComponents
            .changes
            .pipe(
                startWith(this.optionComponents),
                takeUntil(this._destroy$)
            )
            .subscribe((options: QueryList<ArdiumOptionComponent>) => {
                if (options.length == 0) return;
                setTimeout(() => {
                    this.items = options.map(option => ({
                        value: option.value,
                        label: option.label,
                        disabled: option.disabled
                    }));
                    handleOptionChange();
                    this.detectChanges();
                }, 0);
            });
    }

    //! attribute and/or class setters/getters
    private _multiselectable: boolean = false;
    @Input()
    @HostBinding('attr.multiple')
    get multiselectable(): boolean { return this._multiselectable };
    set multiselectable(v: any) { this._multiselectable = coerceBooleanProperty(v); }
    get singleselectable(): boolean { return !this._multiselectable };

    private _clearable: boolean = true;
    @Input()
    get clearable(): boolean { return this._clearable };
    set clearable(v: any) { this._clearable = coerceBooleanProperty(v); }

    private _searchable: boolean = false;
    @Input()
    get searchable(): boolean { return this._searchable };
    set searchable(v: any) { this._searchable = coerceBooleanProperty(v); }

    get filtered(): boolean { return this._searchable && this.searchTerm != '' };

    private _touched: boolean = false;
    get touched(): boolean { return this._touched };
    private set touched(state: boolean) {
        this._touched = state;
    }

    //! custom options
    private _defaultAddCustomFn: AddCustomFn<any> = (value: string) => value;
    private _addCustom: false | AddCustomFn<any> | AddCustomFn<Promise<any>> = false;
    @Input()
    get addCustom(): false | AddCustomFn<any> | AddCustomFn<Promise<any>> {
        return this._addCustom;
    }
    set addCustom(v: string | boolean | AddCustomFn<any> | AddCustomFn<Promise<any>>) {
        if (isFunction(v)) {
            this._addCustom = v;
            return;
        }
        //coerce the value into a boolean
        //if "true", use the default function. Otherwise, just set to "false".
        this._addCustom = coerceBooleanProperty(v) && this._defaultAddCustomFn;
    }

    get shouldShowAddCustom(): boolean {
        return this.addCustom != false && this.searchTerm.length > 0 && this.itemStorage.isNoItemsFound;
    }
    
    async addCustomOption(value: string) {
        if (!this.addCustom) return;

        const newOptionObj = await this.itemStorage.addCustomOption(value, this.addCustom);

        this.selectItem(newOptionObj);
    }

    //! control value accessor
    //override the writeValue and setDisabledState defined in _NgModelComponent
    override setDisabledState(state: boolean): void {
        this._disabled = state;
        this._cd.markForCheck();
    }
    writeValue(ngModel: any[]): void {
        this.itemStorage.handleWriteValue(ngModel);
        this._cd.markForCheck();
    }
    //* change & touch event emitters
    private _emitChanges(): void {
        let value = this.itemStorage.value;
        this._onChangeRegistered?.(value);
        this.changeEvent.emit(value);
        this.valueChange.emit(value);
    }
    private _onTouched(): void {
        this.touched = true;
        this._onTouchedRegistered?.();
    }

    //! value input & output
    @Input()
    set value(newValue: any) {
        //if is a string, coerce it into array of strings
        if (isAnyString(newValue)) newValue = coerceArrayProperty(newValue);
        //if it is not a string and not an array, just put it in an array
        else if (!isArray(newValue)) newValue = [newValue];

        this.writeValue(newValue);
    }
    get value(): any[] {
        return this.itemStorage.value;
    }
    @Output() valueChange = new EventEmitter<any[]>();

    //! output events
    @Output('change') changeEvent = new EventEmitter<any[]>();
    @Output('add') addEvent = new EventEmitter<any[]>();
    @Output('failedToAdd') failedToAddEvent = new EventEmitter<any[]>();
    @Output('remove') removeEvent = new EventEmitter<any[]>();
    @Output('clear') clearEvent = new EventEmitter<null>();
    @Output('open') openEvent = new EventEmitter<null>();
    @Output('close') closeEvent = new EventEmitter<null>();
    @Output('scroll') scrollEvent = new EventEmitter<{ start: number; end: number }>();
    @Output('scrollToEnd') scrollToEndEvent = new EventEmitter();
    @Output('search') searchEvent = new EventEmitter<{ search: string, matching: any[] }>();

    @Input('isOpen')
    isDropdownOpen!: boolean;
    @Output('isOpenChange') isDropdownOpenChange = new EventEmitter<boolean>();

    //! view children
    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(forwardRef(() => ArdiumDropdownPanelComponent)) dropdownPanel!: ArdiumDropdownPanelComponent;

    //! templates
    @ContentChild(ArdOptionTemplateDirective, { read: TemplateRef }) optionTemplate?: TemplateRef<any>;
    @ContentChild(ArdOptgroupTemplateDirective, { read: TemplateRef }) optgroupTemplate?: TemplateRef<any>;
    @ContentChild(ArdValueTemplateDirective, { read: TemplateRef }) valueTemplate?: TemplateRef<any>;
    @ContentChild(ArdSelectPlaceholderTemplateDirective, { read: TemplateRef }) placeholderTemplate?: TemplateRef<any>;
    @ContentChild(ArdLoadingSpinnerTemplateDirective, { read: TemplateRef }) loadingSpinnerTemplate?: TemplateRef<any>;
    @ContentChild(ArdLoadingPlaceholderTemplateDirective, { read: TemplateRef }) loadingPlaceholderTemplate?: TemplateRef<any>;
    @ContentChild(ArdDropdownHeaderTemplateDirective, { read: TemplateRef }) dropdownHeaderTemplate?: TemplateRef<any>;
    @ContentChild(ArdDropdownFooterTemplateDirective, { read: TemplateRef }) dropdownFooterTemplate?: TemplateRef<any>;
    @ContentChild(ArdNoItemsFoundTemplateDirective, { read: TemplateRef }) noItemsFoundTemplate?: TemplateRef<any>;
    @ContentChild(ArdAddCustomTemplateDirective, { read: TemplateRef }) addCustomTemplate?: TemplateRef<any>;
    @ContentChild(ArdItemLimitReachedTemplateDirective, { read: TemplateRef }) itemLimitReachedTemplate?: TemplateRef<any>;
    @ContentChild(ArdItemDisplayLimitTemplateDirective, { read: TemplateRef }) itemDisplayLimitTemplate?: TemplateRef<any>;
    
    //! context providers
    getValueContext(item: ArdOption): ValueContext {
        const $this = this;
        return {
            $implicit: item,
            item,
            itemData: item.itemData,
            unselect() {
                $this.unselectItem(item);
            },
        }
    }
    getStatsContext(): StatsContext {
        return {
            totalItems: this.totalItems,
            foundItems: this.foundItems,
        }
    }
    getSearchContext(): SearchContext {
        return {
            $implicit: this.searchTerm,
            searchTerm: this.searchTerm,
            totalItems: this.totalItems,
            foundItems: this.foundItems,
        };
    }
    getPlaceholderContext(): PlaceholderContext {
        const placeholder = this.placeholderForCurrentContext;
        return {
            placeholder,
            $implicit: placeholder,
        };
    }
    getCustomOptionContext(): CustomOptionContext {
        return {
            $implicit: this.searchTerm,
            searchTerm: this.searchTerm,
        };
    }
    getGroupContext(group: ArdOptionGroup): GroupContext {
        return {
            $implicit: group,
            group,
            selectedChildren: group.children.filter(v => v.selected).length,
            totalChildren: group.children.length,
        }
    }
    getOptionContext(item: ArdOption): OptionContext {
        return {
            $implicit: item,
            item,
            itemData: item.itemData,
        }
    }
    getItemLimitContext(): ItemLimitContext {
        return {
            totalItems: this.totalItems,
            selectedItems: this.itemStorage.selectedItems.length,
            itemLimit: this.maxSelectedItems,
        }
    }
    getItemDisplayLimitContext(): ItemDisplayLimitContext {
        let selectedItems = this.itemStorage.selectedItems.length;
        return {
            totalItems: this.totalItems,
            selectedItems,
            itemLimit: this.maxSelectedItems,
            overflowCount: selectedItems - (this.itemDisplayLimit ?? 0),
        }
    }

    constructor(
        _elementRef: ElementRef<HTMLElement>,
        private _cd: ChangeDetectorRef,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private scrollStrategyOpts: ScrollStrategyOptions,
    ) {
        super();
        this.element = _elementRef.nativeElement;
    }

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
        // delete this.dropdownOverlay;
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

    //! hooks
    ngOnInit(): void {
        this._setSearchInputAttributes();
    }
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }
    ngAfterViewInit(): void {
        if (this.autoFocus) {
            this.focus();
        }
    }
    ngAfterContentInit(): void {
        if (!this.isItemsInputUsed) {
            this._setItemsFromComponents();
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        //fire items load handler when loading is set to false
        if (changes['loading']) {
            if (changes['loading'].currentValue == false) {
                this._onItemsLoad();
            }
        }
        //set groupItems to true by default if groupLabelFrom or itemsAlreadyGrouped is set to true as the first change
        if (
            (
                changes['groupLabelFrom']?.firstChange ||
                changes['itemsAlreadyGrouped']?.firstChange
            ) &&
            !changes['groupItems']
        ) {
            this.groupItems = true;
        }
    }
    private _onItemsLoad() {
        if (!this._searchBarFocused) return;
        this.open();
    }
    private _printPrimitiveWarnings() {
        function makeWarning(str: string): void {
            console.warn(`Skipped using [${str}] property bound to <ard-select>, as some provided items are of primitive type`);
        }
        if (this.valueFrom) {
            makeWarning('valueFrom');
        }
        if (this.labelFrom) {
            makeWarning('labelFrom');
        }
        if (this.disabledFrom) {
            makeWarning('disabledFrom');
        }
        if (this.groupLabelFrom) {
            makeWarning('groupLabelFrom');
        }
        if (this.groupDisabledFrom) {
            makeWarning('groupDisabledFrom');
        }
        if (this.childrenFrom) {
            makeWarning('childrenFrom');
        }
        if (this.invertDisabled) {
            makeWarning('invertDisabled');
        }
    }

    //! getters
    get firstHighlightedItem(): ArdOption | undefined {
        return this.itemStorage.highlightedItems?.first();
    }
    get shouldDisplayPlaceholder(): boolean {
        return !this.itemStorage.isAnyItemSelected && !this.searchTerm;
    }
    get shouldDisplayValue(): boolean {
        return this.itemStorage.isAnyItemSelected && (!this.searchTerm || this.multiselectable);
    }
    get shouldShowClearButton(): boolean {
        return this._clearable && !this._disabled && (this.itemStorage.isAnyItemSelected || this.searchTerm != '');
    }
    get itemsToDisplay(): IterableIterator<ArdOptionGroup> {
        return this.itemStorage.groups.values();
    }
    get shouldShowNoItemsFound(): boolean {
        return this.itemStorage.isNoItemsFound && !this.isLoading && !this.shouldShowAddCustom;
    }
    get totalItems(): number {
        return this.itemStorage.items.length;
    }
    get foundItems(): number | undefined {
        if (!this.searchable) return undefined;
        return this.itemStorage.filteredItems.length;
    }
    get shouldShowItemDisplayLimit(): boolean {
        return (
            this.multiselectable &&
            this.itemDisplayLimit != Infinity &&
            this.itemStorage.selectedItems.length > this.itemDisplayLimit
        );
    }
    get isInputElementReadonly(): boolean {
        return !this.addCustom && (!this.searchable || this.itemStorage.isItemLimitReached)
    }
    isValueWithinDisplayLimit(i: number): boolean {
        return (
            !this.multiselectable ||
            this.itemDisplayLimit == Infinity ||
            i < this.itemDisplayLimit
        );
    }
    get placeholderForCurrentContext(): string {
        if (this.searchPlaceholder && this._searchBarFocused)
            return this.searchPlaceholder;
        return this.placeholder;
    }

    //! search input event handlers
    filter(filterTerm: string, suppressSearchEvent: boolean = false): void {
        this.searchTerm = filterTerm;
        let matching = this.itemStorage.filter(filterTerm);
        if (!suppressSearchEvent) this.searchEvent.emit({ search: filterTerm, matching });
        this.open();
    }
    onSearchInputFocus(event: FocusEvent): void {
        if (this._searchBarFocused) return;

        this._searchBarFocused = true;
        this.focusEvent.emit(event);
    }
    onSearchInputBlur(event: FocusEvent): void {
        if (!this._searchBarFocused) return;

        this._onTouched();

        this._searchBarFocused = false;
        this.blurEvent.emit(event);
    }
    //! item selection handlers
    toggleItem(item: ArdOption): void {
        if (item.selected) {
            this.unselectItem(item);
            return;
        }
        this.selectItem(item);
    }
    selectItem(...items: ArdOption[]): void {
        let [selected, unselected, failedToSelect] = this.itemStorage.selectItem(...items);

        if (unselected.length > 0) this.removeEvent.emit(unselected);

        if (failedToSelect.length > 0) {
            this.failedToAddEvent.emit(failedToSelect);
        };

        if (selected.length > 0) {
            this.addEvent.emit(selected);
            this._emitChanges();

            this.focus();
            if (!this.keepSearchAfterSelect) this._clearSearch(true);

            if (!this.keepOpen || this.itemStorage.isNoItemsToSelect) {
                this.close();
            }
        }
    }
    unselectItem(...items: ArdOption[]): void {
        let unselected = this.itemStorage.unselectItem(...items);

        this.removeEvent.emit(unselected);
        this._emitChanges();
        if (!this.keepSearchAfterSelect) this._clearSearch();

        this.focus();

        if (!this.keepOpen || this.itemStorage.isNoItemsToSelect) {
            this.close();
        }
    }
    private _clearAllItems(): void {
        let cleared = this.itemStorage.clearAllSelected(true);

        this.focus();

        this.clearEvent.emit();
        this.removeEvent.emit(cleared);
        this._emitChanges();
    }
    private _clearLastItem(): void {
        let clearedValue = this.itemStorage
            .clearLastSelected()
            .value;

        this.focus();

        this.removeEvent.emit([clearedValue]);
        this._emitChanges();
    }
    //! highligh-related
    onMouseMove() {
        this._isMouseBeingUsed = true;
    }
    onGroupMouseover(group: ArdOptionGroup): void {
        if (!this.multiselectable || this.noGroupActions) return;
        this.itemStorage.highlightGroup(group);
    }
    onItemMouseOver(event: MouseEvent): void {
        event.stopPropagation();
    }
    onItemMouseEnter(option: ArdOption, event: MouseEvent): void {
        if (!this._isMouseBeingUsed) return;
        this.itemStorage.highlightSingleItem(option);
        event.stopPropagation();
    }
    onItemMouseLeave(option: ArdOption, event: MouseEvent): void {
        if (!this._isMouseBeingUsed) return;
        this.itemStorage.unhighlightItem(option);
        event.stopPropagation();
    }
    //! click handlers
    onItemClick(option: ArdOption, event: MouseEvent): void {
        event.stopPropagation();
        if (this.clearable) this.toggleItem(option);
        else this.selectItem(option);
    }
    onGroupClick(group: ArdOptionGroup): void {
        if (!this.multiselectable || this.noGroupActions) return;
        if (group.children.every(o => o.selected)) {
            this.unselectItem(...group.children);
            return;
        }
        this.selectItem(...group.children);
    }
    handleClearButtonClick(event: MouseEvent): void {
        event.stopPropagation();
        if (this.searchTerm) {
            this._clearSearch();
            return;
        }
        this._clearAllItems();
    }
    handleDropdownArrowClick(event: MouseEvent): void {
        event.stopPropagation();
        this.toggle();
    }
    handleOutsideClick(event: MouseEvent): void {
        if (!this.isDropdownOpen) return;
        const target = event.target as HTMLElement;
        if (this.element.contains(target)) return;

        this.close();
    }
    handleAnywhereClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.tagName != 'INPUT') {
            event.preventDefault();
        }

        if (!this._searchBarFocused) {
            this.focus();
        }

        if (this._searchable) {
            this.open();
        } else {
            this.toggle();
        }
    }
    //! dropdown state handlers
    toggle(): void {
        if (this.isDropdownOpen) {
            this.close();
            return;
        }
        this.open();
    }
    open(): void {
        if (this.disabled || this.isDropdownOpen) return;

        this.isDropdownOpen = true;
        if (this.autoHighlightFirst) this.itemStorage.highlightFirstItem();

        this._createOverlay();

        this.openEvent.emit();
        this.isDropdownOpenChange.emit(this.isDropdownOpen);
        this.detectChanges();
    }
    close(): void {
        if (!this.isDropdownOpen) return;

        this.isDropdownOpen = false;

        this._destroyOverlay();

        this._onTouched();
        this.closeEvent.emit();
        this.isDropdownOpenChange.emit(this.isDropdownOpen);
        this._cd.markForCheck();
    }
    //! ChangeDetectorRef
    detectChanges(): void {
        if (!(<any>this._cd).destroyed) {
            this._cd.detectChanges();
        }
    }
    //! search
    private _clearSearch(suppressSearchEvent: boolean = false): void {
        this._setSearch('', suppressSearchEvent);
    }
    private _setSearch(searchTerm: string, suppressSearchEvent: boolean = false): void {
        this.searchTerm = searchTerm;
        this.filter(searchTerm, suppressSearchEvent);
    }
    private _setSearchInputAttributes() {
        const input = this.searchInput.nativeElement;
        const attributes: { [key: string]: string } = {
            type: 'text',
            autocorrect: 'off',
            autocapitalize: 'off',
            autocomplete: 'off',
            ...this.inputAttrs
        };

        for (const key of Object.keys(attributes)) {
            input.setAttribute(key, attributes[key]);
        }
    }

    //! key press handlers
    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Enter': {
                this._onEnterPress(event);
                return;
            }
            case 'Space': {
                this._onSpacePress(event);
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
            case 'Home': {
                this._onHomePress(event);
                return;
            }
            case 'End': {
                this._onEndPress(event);
                return;
            }
            case 'Backspace':
            case 'Delete': {
                this._onBackspaceOrDeletePress(event);
                return;
            }
            case 'KeyA': {
                if (event.ctrlKey) {
                    this._onCtrlAPress(event);
                    return;
                }
            }
        }
    }
    private async _onEnterPress(event: KeyboardEvent) {
        event.preventDefault();
        let shouldClose = true;
        
        //select the currently highlighted option
        if (this.isDropdownOpen && this.firstHighlightedItem) {
            if (
                this.clearable
                &&
                this.itemStorage
                    .highlightedItems
                    .every(item => item.selected)
            ) {
                this.unselectItem(...this.itemStorage.highlightedItems);
            }
            else {
                this.selectItem(...this.itemStorage.highlightedItems);
            }
        }
        //add a custom option
        else if (this.isDropdownOpen && this.shouldShowAddCustom) {
            await this.addCustomOption(this.searchTerm);
        }
        //in case of no action, open the dropdown (or keep it open)
        else shouldClose = false;

        if (!this.keepOpen && shouldClose) {
            this.itemStorage.clearAllHighlights();
            this.close();
        }
        else {
            this.open();
        }
    }
    private _onSpacePress(event: KeyboardEvent): void {
        if (this.isDropdownOpen) return;

        event.preventDefault();
        this.open();
    }
    private _onArrowDownPress(event: KeyboardEvent): void {
        event.preventDefault();
        this.open();

        this._isMouseBeingUsed = false;

        const recentlyHighlighted = this.itemStorage.highlightNextItem(+1, event.shiftKey);
        if (recentlyHighlighted) {
            this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
        }

        this.dropdownPanel.scrollToRecentlyHighlighted('bottom');
    }
    private _onArrowUpPress(event: KeyboardEvent): void {
        if (!this.isDropdownOpen) return;
        event.preventDefault();

        this._isMouseBeingUsed = false;

        const recentlyHighlighted = this.itemStorage.highlightNextItem(-1, event.shiftKey);
        if (recentlyHighlighted) {
            this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
        }

        this.dropdownPanel.scrollToRecentlyHighlighted('top');
    }
    private _onHomePress(event: KeyboardEvent): void {
        if (
            !this.isDropdownOpen ||
            this.searchInput.nativeElement.selectionEnd != 0 &&
            this.searchInput.nativeElement.selectionStart != 0
        ) return;
        event.preventDefault();
            
        this._isMouseBeingUsed = false;
        
        const recentlyHighlighted = this.itemStorage.highlightFirstItem();
        if (!recentlyHighlighted) return;

        this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
        this.dropdownPanel.scrollToRecentlyHighlighted('top');
    }
    private _onEndPress(event: KeyboardEvent): void {
        if (
            !this.isDropdownOpen ||
            this.searchInput.nativeElement.selectionEnd != this.searchTerm.length &&
            this.searchInput.nativeElement.selectionStart != this.searchTerm.length
        ) return;
        event.preventDefault();

        this._isMouseBeingUsed = false;

        const recentlyHighlighted = this.itemStorage.highlightLastItem();
        if (!recentlyHighlighted) return;

        this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
        this.dropdownPanel.scrollToRecentlyHighlighted('bottom');
    }
    private _onBackspaceOrDeletePress(event: KeyboardEvent): void {
        if (
            this.searchTerm ||
            !this._clearable ||
            this.noBackspaceClear ||
            !this.itemStorage.isAnyItemSelected
        ) return;

        event.preventDefault();
        if (
            this.multiselectable &&
            this.itemStorage.selectedItems.length > 1
        ) {
            this._clearLastItem();
            return;
        }
        this._clearAllItems();
    }
    private _onCtrlAPress(event: KeyboardEvent): void {
        this.itemStorage.highlightAllItems();
    }
}