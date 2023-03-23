import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from 'projects/devkit/src/public-api';
import { isFunction } from 'simple-bool';
import { ArdiumDropdownPanelComponent } from '../dropdown-panel/dropdown-panel.component';
import { searchFunctions } from '../search-functions';
import { FormElementAppearance } from '../types/theming.types';
import { ItemStorage } from '../_internal/item-storages/dropdown-item-storage';
import { ArdOption, ArdOptionGroup, ArdPanelPosition, CompareWithFn, GroupByFn, SearchFn } from '../_internal/item-storages/item-storage.types';
import { _NgModelComponent } from '../_internal/ngmodel-component';
import { ArdDropdownFooterTemplateDirective, ArdDropdownHeaderTemplateDirective, ArdItemDisplayLimitTemplateDirective, ArdItemLimitReachedTemplateDirective, ArdLoadingPlaceholderTemplateDirective, ArdLoadingSpinnerTemplateDirective, ArdNoItemsFoundTemplateDirective, ArdOptgroupTemplateDirective, ArdOptionTemplateDirective, ArdPlaceholderTemplateDirective, ArdValueTemplateDirective } from './select.directive';
import { GroupContext, ItemDisplayLimitContext, ItemLimitContext, OptionContext, SearchContext, StatsContext, ValueContext } from './select.types';

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
export class ArdiumSelectComponent extends _NgModelComponent implements OnChanges, AfterContentInit, OnInit, ControlValueAccessor {

    //* public constants
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

    //* privates
    private _items: any[] | null = [];
    private _isMouseBeingUsed = false;
    @HostBinding('class.ard-select-focused') private _searchBarFocused = false;

    //* publics
    public searchTerm: string = '';

    //* binding-related inputs
    //value/label/disabled/group/pre-grouped children paths
    @Input() valueFrom?: string;
    @Input() labelFrom?: string;
    @Input() disabledFrom?: string;
    //* group-related inputs
    @Input() groupLabelFrom?: string | GroupByFn;
    @Input() groupDisabledFrom?: string;
    @Input() itemsAlreadyGrouped: boolean = false;
    @Input() childrenFrom?: string;
    //should the value that the "disabledFrom" path lead to be inverted?
    //useful when the property is e.g. "active", which is the oposite of "disabled"
    @Input() invertDisabled: boolean = false;
    @Input() groupActions: boolean = true;
    //* settings
    @Input() placeholder: string = 'Select item';
    @Input() autoHighlightFirst: boolean = true;
    @Input() autoFocus: boolean = false;
    @Input() closeOnSelect: boolean = true;
    @Input() hideSelected: boolean = false;
    @Input() clearOnBackspace: boolean = true;
    @Input() dropdownPosition: ArdPanelPosition = ArdPanelPosition.Auto;
    @Input() clearButtonTitle: string = this.DEFAULTS.clearButtonTitle;
    @Input() sortMultipleValues: boolean = false;
    @Input() maxSelectedItems?: number;
    @Input() itemDisplayLimit: number = Infinity;
    //* template-related settings
    @Input() noItemsFoundText: string = this.DEFAULTS.noItemsFoundText;
    @Input() loadingPlaceholderText: string = this.DEFAULTS.loadingPlaceholderText;
    //* search-related options
    @Input() searchInputId?: string;
    @Input() searchCaseSensitive: boolean = false;
    @Input() clearSearchAfterSelect: boolean = true;
    //* appearance
    @Input()
    appearance: FormElementAppearance = FormElementAppearance.Outlined;
    //* other inputs
    @Input() isLoading: boolean = false;
    @Input() inputAttrs: { [key: string]: any } = {};

    //* function inputs
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

    //* class-based inputs
    @Input() @HostBinding('class.ard-group-items') groupItems: boolean = false; //default value may be changed to "true" in ngOnChanges if this.groupBy is defined or this.itemsAlreadyGrouped is set to "true"

    //* items setter/getter
    @Input()
    get items() { return this._items }
    set items(value: any[] | null) {
        if (value === null) {
            value = [];
        }
        this._items = value;
    };

    @Input()
    @HostBinding('class.ard-select')
    useDefaultClass: boolean = true;

    //* attribute and/or class setters/getters
    private _multiselectable: boolean = false;
    @Input()
    @HostBinding('attr.multiple')
    @HostBinding('class.ard-multiselect')
    get multiselectable(): boolean { return this._multiselectable };
    set multiselectable(v: any) { this._multiselectable = coerceBooleanProperty(v); }
    @HostBinding('class.ard-singleselect')
    get singleselectable(): boolean { return !this._multiselectable };

    private _clearable: boolean = true;
    @Input()
    @HostBinding('class.ard-clearable')
    get clearable(): boolean { return this._clearable };
    set clearable(v: any) { this._clearable = coerceBooleanProperty(v); }

    private _searchable: boolean = false;
    @Input()
    @HostBinding('class.ard-searchable')
    get searchable(): boolean { return this._searchable };
    set searchable(v: any) { this._searchable = coerceBooleanProperty(v); }

    @HostBinding('class.ard-filtered')
    get filtered(): boolean { return this._searchable && this.searchTerm != '' };

    private _touched: boolean = false;
    @HostBinding('class.ard-touched')
    get touched(): boolean { return this._touched };
    set touched(state: boolean) {
        this._touched = state;
    }

    //* control value accessor
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

    //* value input & output
    @Input()
    set value(newValue: any[]) {
        this.writeValue(newValue);
    }
    @Output() valueChange = new EventEmitter<any[]>();

    //* output events
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
    @HostBinding('class.ard-dropdown-open')
    isDropdownOpen!: boolean;
    @Output('isOpenChange') isDropdownOpenChange = new EventEmitter<boolean>();

    //* view children
    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(forwardRef(() => ArdiumDropdownPanelComponent)) dropdownPanel!: ArdiumDropdownPanelComponent;

    //* templates
    @ContentChild(ArdOptionTemplateDirective, { read: TemplateRef }) optionTemplate?: TemplateRef<any>;
    @ContentChild(ArdOptgroupTemplateDirective, { read: TemplateRef }) optgroupTemplate?: TemplateRef<any>;
    @ContentChild(ArdValueTemplateDirective, { read: TemplateRef }) valueTemplate?: TemplateRef<any>;
    @ContentChild(ArdPlaceholderTemplateDirective, { read: TemplateRef }) placeholderTemplate?: TemplateRef<any>;
    @ContentChild(ArdLoadingSpinnerTemplateDirective, { read: TemplateRef }) loadingSpinnerTemplate?: TemplateRef<any>;
    @ContentChild(ArdLoadingPlaceholderTemplateDirective, { read: TemplateRef }) loadingPlaceholderTemplate?: TemplateRef<any>;
    @ContentChild(ArdDropdownHeaderTemplateDirective, { read: TemplateRef }) dropdownHeaderTemplate?: TemplateRef<any>;
    @ContentChild(ArdDropdownFooterTemplateDirective, { read: TemplateRef }) dropdownFooterTemplate?: TemplateRef<any>;
    @ContentChild(ArdNoItemsFoundTemplateDirective, { read: TemplateRef }) noItemsFoundTemplate?: TemplateRef<any>;
    @ContentChild(ArdItemLimitReachedTemplateDirective, { read: TemplateRef }) itemLimitReachedTemplate?: TemplateRef<any>;
    @ContentChild(ArdItemDisplayLimitTemplateDirective, { read: TemplateRef }) itemDisplayLimitTemplate?: TemplateRef<any>;
    
    //* context providers
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
            searchTerm: this.searchTerm,
            totalItems: this.totalItems,
            foundItems: this.foundItems,
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
    ) {
        super();
        this.element = _elementRef.nativeElement;
    }

    //* hooks
    override ngOnInit(): void {
        this._setSearchInputAttributes();
    }
    ngAfterContentInit(): void {
        if (this.autoFocus) {
            this.focus();
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['loading']) {
            if (
                changes['loading'].currentValue == false &&
                !changes['loading'].firstChange
            ) {
                this._onItemsLoad();
            }
        }
        if (
            (
                changes['groupLabelFrom']?.firstChange ||
                changes['itemsAlreadyGrouped']?.firstChange
            ) &&
            !changes['groupItems']
        ) {
            this.groupItems = true;
        }
        if (changes['items']) {
            let printErrors = this.itemStorage.setItems(changes['items'].currentValue);
            if (printErrors) {
                this._printPrimitiveWarnings();
            }
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

    //* getters
    get firstHighlightedItem(): ArdOption | undefined {
        return this.itemStorage.highlightedItems?.first();
    }
    get shouldShowClearButton(): boolean {
        return this._clearable && !this._disabled && (this.itemStorage.isAnyItemSelected || this.searchTerm != '');
    }
    get itemsToDisplay(): IterableIterator<ArdOptionGroup> {
        return this.itemStorage.groups.values();
    }
    get shouldShowNoItemsFound(): boolean {
        return this.itemStorage.isNoItemsFound && !this.isLoading;
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
    isValueWithinDisplayLimit(i: number): boolean {
        return (
            !this.multiselectable ||
            this.itemDisplayLimit == Infinity ||
            i < this.itemDisplayLimit
        );
    }

    //* search input event handlers
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
    //* item selection handlers
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
            if (this.clearSearchAfterSelect) this._clearSearch(true);

            if (this.closeOnSelect || this.itemStorage.isNoItemsToSelect) {
                this.close();
            }
        }
    }
    unselectItem(...items: ArdOption[]): void {
        let unselected = this.itemStorage.unselectItem(...items);

        this.removeEvent.emit(unselected);
        this._emitChanges();
        if (this.clearSearchAfterSelect) this._clearSearch();

        this.focus();

        if (this.closeOnSelect || this.itemStorage.isNoItemsToSelect) {
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
    //* highligh-related
    onMouseMove() {
        this._isMouseBeingUsed = true;
    }
    onGroupMouseover(group: ArdOptionGroup): void {
        if (!this.multiselectable || !this.groupActions) return;
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
    //* click handlers
    onItemClick(option: ArdOption, event: MouseEvent): void {
        event.stopPropagation();
        if (this.clearable) this.toggleItem(option);
        else this.selectItem(option);
    }
    onGroupClick(group: ArdOptionGroup): void {
        if (!this.multiselectable || !this.groupActions) return;
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
    //* dropdown state handlers
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

        this.openEvent.emit();
        this.isDropdownOpenChange.emit(this.isDropdownOpen);
        this.detectChanges();
    }
    close(): void {
        if (!this.isDropdownOpen) return;

        this.isDropdownOpen = false;
        this._onTouched();
        this.closeEvent.emit();
        this.isDropdownOpenChange.emit(this.isDropdownOpen);
        this._cd.markForCheck();
    }
    //* ChangeDetectorRef
    detectChanges(): void {
        if (!(<any>this._cd).destroyed) {
            this._cd.detectChanges();
        }
    }
    //* search
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

    //* key press handlers
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
    private _onEnterPress(event: KeyboardEvent): void {
        event.preventDefault();
        let shouldClose = false;
        
        if (this.isDropdownOpen && this.firstHighlightedItem) {
            shouldClose = true;

            if (this.itemStorage
                .highlightedItems
                .every(item => item.selected)
            ) {
                this.unselectItem(...this.itemStorage.highlightedItems);
            }
            else {
                this.selectItem(...this.itemStorage.highlightedItems);
            }
        }
        if (this.closeOnSelect && shouldClose) {
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
            !this.clearOnBackspace ||
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