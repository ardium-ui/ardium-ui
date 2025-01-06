import { Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  Signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceArrayProperty, coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { Subject, merge, startWith, takeUntil } from 'rxjs';
import { isAnyString, isArray, isFunction } from 'simple-bool';
import { ItemStorage, ItemStorageHost } from '../_internal/item-storages/dropdown-item-storage';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ArdiumDropdownPanelComponent } from '../dropdown-panel/dropdown-panel.component';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../dropdown-panel/dropdown-panel.types';
import { ArdiumOptionComponent } from '../option/option.component';
import { ArdOption, ArdOptionGroup, ArdPanelPosition, GroupByFn, OptionContext, SearchFn } from '../types/item-storage.types';
import { FormElementAppearance } from '../types/theming.types';
import { Nullable } from '../types/utility.types';
import { FormElementVariant } from './../types/theming.types';
import { ARD_SELECT_DEFAULTS, ArdSelectDefaults } from './select.defaults';
import {
  ArdAddCustomTemplateDirective,
  ArdDropdownFooterTemplateDirective,
  ArdDropdownHeaderTemplateDirective,
  ArdItemDisplayLimitTemplateDirective,
  ArdItemLimitReachedTemplateDirective,
  ArdLoadingPlaceholderTemplateDirective,
  ArdLoadingSpinnerTemplateDirective,
  ArdNoItemsFoundTemplateDirective,
  ArdOptgroupTemplateDirective,
  ArdOptionTemplateDirective,
  ArdSelectPlaceholderTemplateDirective,
  ArdSelectPrefixTemplateDirective,
  ArdSelectSuffixTemplateDirective,
  ArdValueTemplateDirective,
} from './select.directive';
import {
  AddCustomFn,
  CustomOptionContext,
  GroupContext,
  ItemDisplayLimitContext,
  ItemLimitContext,
  PlaceholderContext,
  SearchContext,
  StatsContext,
  ValueContext,
} from './select.types';

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
      multi: true,
    },
  ],
})
export class ArdiumSelectComponent
  extends _NgModelComponentBase
  implements OnChanges, AfterViewInit, AfterContentInit, OnInit, OnDestroy, ControlValueAccessor, ItemStorageHost
{
  protected override readonly _DEFAULTS!: ArdSelectDefaults;
  constructor(@Inject(ARD_SELECT_DEFAULTS) defaults: ArdSelectDefaults) {
    super(defaults);
  }

  readonly _componentId: string = '000';
  readonly itemStorage = new ItemStorage(this);

  //! privates
  private _items: any[] | null = [];
  private readonly _isMouseBeingUsed = signal<boolean>(false);
  private readonly _searchBarFocused = signal<boolean>(false);
  private readonly _destroy$ = new Subject<void>();

  //! publics
  readonly searchTerm = signal<string>('');
  isItemsInputUsed = false;

  //! binding-related inputs
  //value/label/disabled/group/pre-grouped children paths
  readonly valueFrom = input<string>(this._DEFAULTS.valueFrom);
  readonly labelFrom = input<string>(this._DEFAULTS.labelFrom);
  readonly disabledFrom = input<string>(this._DEFAULTS.disabledFrom);
  //! group-related inputs
  readonly groupLabelFrom = input<string | GroupByFn>(this._DEFAULTS.groupLabelFrom);
  readonly groupDisabledFrom = input<string>(this._DEFAULTS.groupDisabledFrom);
  readonly childrenFrom = input<string>(this._DEFAULTS.childrenFrom);
  //! settings
  readonly placeholder = input<string>(this._DEFAULTS.placeholder);
  readonly searchPlaceholder = input<string>(this._DEFAULTS.searchPlaceholder);
  readonly clearButtonTitle = input<string>(this._DEFAULTS.clearButtonTitle);

  readonly dropdownPosition = input<ArdPanelPosition>(this._DEFAULTS.dropdownPosition);
  //! template-related settings
  readonly noItemsFoundText = input<string>(this._DEFAULTS.noItemsFoundText);
  readonly loadingPlaceholderText = input<string>(this._DEFAULTS.loadingPlaceholderText);
  //! search-related options
  readonly searchInputId = input<Nullable<string>>(undefined);
  readonly inputAttrs = input<Record<string, any>>(this._DEFAULTS.inputAttrs);
  //! other inputs
  readonly isLoading = input<boolean, any>(this._DEFAULTS.isLoading, { transform: v => coerceBooleanProperty(v) });
  readonly htmlId = input<string>(crypto.randomUUID());

  //! boolean settings
  readonly itemsAlreadyGrouped = input<boolean, any>(this._DEFAULTS.itemsAlreadyGrouped, {
    transform: v => coerceBooleanProperty(v),
  });

  readonly invertDisabled = input<boolean, any>(this._DEFAULTS.invertDisabled, { transform: v => coerceBooleanProperty(v) });

  readonly noGroupActions = input<boolean, any>(this._DEFAULTS.noGroupActions, { transform: v => coerceBooleanProperty(v) });
  readonly autoHighlightFirst = input<boolean, any>(this._DEFAULTS.autoHighlightFirst, {
    transform: v => coerceBooleanProperty(v),
  });
  readonly autoFocus = input<boolean, any>(this._DEFAULTS.autoFocus, { transform: v => coerceBooleanProperty(v) });
  readonly keepOpen = input<boolean, any>(this._DEFAULTS.keepOpen, { transform: v => coerceBooleanProperty(v) });
  readonly hideSelected = input<boolean, any>(this._DEFAULTS.hideSelected, { transform: v => coerceBooleanProperty(v) });
  readonly noBackspaceClear = input<boolean, any>(this._DEFAULTS.noBackspaceClear, { transform: v => coerceBooleanProperty(v) });
  readonly sortMultipleValues = input<boolean, any>(this._DEFAULTS.sortMultipleValues, {
    transform: v => coerceBooleanProperty(v),
  });
  readonly searchCaseSensitive = input<boolean, any>(this._DEFAULTS.searchCaseSensitive, {
    transform: v => coerceBooleanProperty(v),
  });
  readonly keepSearchAfterSelect = input<boolean, any>(this._DEFAULTS.keepSearchAfterSelect, {
    transform: v => coerceBooleanProperty(v),
  });

  //! number inputs
  readonly maxSelectedItems = input<number, any>(this._DEFAULTS.maxSelectedItems, {
    transform: v => coerceNumberProperty(v, this._DEFAULTS.maxSelectedItems),
  });
  readonly itemDisplayLimit = input<number, any>(this._DEFAULTS.itemDisplayLimit, {
    transform: v => coerceNumberProperty(v, this._DEFAULTS.itemDisplayLimit),
  });

  //! function inputs
  readonly searchFn = input<SearchFn>(this._DEFAULTS.searchFn);
  readonly compareWith = input<Nullable<SearchFn>>(this._DEFAULTS.compareWith);

  //! appearance
  readonly appearance = input<FormElementAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<FormElementVariant>(this._DEFAULTS.variant);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      //appearance and variant handled in ard-form-field-frame component
      this.compact() ? 'ard-compact' : '',
      this.multiselectable() ? 'ard-multiselect' : 'ard-singleselect',
      this.clearable() ? 'ard-clearable' : '',
      this.searchable() ? 'ard-searchable' : '',
      this.filtered() ? 'ard-filtered' : '',
      this.touched() ? 'ard-touched' : '',
      this.isOpen() ? 'ard-dropdown-open' : '',
      this._searchBarFocused() ? 'ard-select-focused' : '',
      this._searchBarFocused() ? 'ard-select-focused' : '',
    ].join(' ')
  );

  readonly dropdownAppearance = input<Nullable<DropdownPanelAppearance>>(this._DEFAULTS.dropdownAppearance);
  readonly dropdownAppearanceOrDefault = computed(() => {
    if (this.dropdownAppearance()) return this.dropdownAppearance()!;
    if (this.appearance() === FormElementAppearance.Outlined) return DropdownPanelAppearance.Outlined;
    return DropdownPanelAppearance.Raised;
  });
  readonly dropdownVariant = input<Nullable<DropdownPanelVariant>>(this._DEFAULTS.dropdownVariant);
  readonly dropdownVariantOrDefault = computed(() => {
    if (this.dropdownVariant()) return this.dropdownVariant()!;
    const variant = this.variant();
    if (variant === FormElementVariant.Pill) return DropdownPanelVariant.Rounded;
    return variant;
  });

  @HostBinding('class.ard-group-items')
  get _groupItemsHostAttribute() {
    return this.groupLabelFrom();
  }

  //! items setter/getter
  @Input()
  get items() {
    return this._items;
  }
  set items(value: string | any[] | null) {
    this.isItemsInputUsed = true;
    if (value === null) {
      value = [];
      this.isItemsInputUsed = false;
    } else if (isAnyString(value)) {
      value = coerceArrayProperty(value);
    }
    this.itemStorage.setItems(value);
  }

  @ContentChildren(ArdiumOptionComponent)
  optionComponents!: QueryList<ArdiumOptionComponent>;

  private _setItemsFromComponents() {
    const handleOptionChange = () => {
      const changedOrDestroyed = merge(this.optionComponents.changes, this._destroy$);
      merge(...this.optionComponents.map(option => option.stateChange$))
        .pipe(takeUntil(changedOrDestroyed))
        .subscribe(option => {
          setTimeout(() => {
            const item = this.itemStorage.findItemByValue(option.oldValue ?? option.value);
            if (item) {
              item.disabled.set(option.disabled);
              item.label.set(option.label || item.label());
              item.value.set(option.value);
              item.itemData.set({
                label: option.label || item.label(),
                value: option.value,
                disabled: option.disabled,
              });
            }
            this.detectChanges();
          }, 0);
        });
    };
    this.optionComponents.changes
      .pipe(startWith(this.optionComponents), takeUntil(this._destroy$))
      .subscribe((options: QueryList<ArdiumOptionComponent>) => {
        if (options.length === 0) return;
        setTimeout(() => {
          this.items = options.map(option => {
            return {
              value: option.value() ?? option.labelOrInnerHtml,
              label: option.labelOrInnerHtml ?? option.value(),
              disabled: option.disabled(),
            };
          });
          handleOptionChange();
          this.detectChanges();
        }, 0);
      });
  }

  //! attribute and/or class setters/getters
  readonly multiselectable = input<boolean, any>(this._DEFAULTS.multiselectable, { transform: v => coerceBooleanProperty(v) });
  readonly clearable = input<boolean, any>(this._DEFAULTS.clearable, { transform: v => coerceBooleanProperty(v) });
  readonly searchable = input<boolean, any>(this._DEFAULTS.searchable, { transform: v => coerceBooleanProperty(v) });

  readonly filtered = computed<boolean>(() => this.searchable() && this.searchTerm() !== '');

  readonly touched = signal<boolean>(false);

  //! custom options
  private _defaultAddCustomFn: AddCustomFn<any> = (value: string) => value;

  readonly addCustom = input<
    false | AddCustomFn<any> | AddCustomFn<Promise<any>>,
    string | boolean | AddCustomFn<any> | AddCustomFn<Promise<any>>
  >(this._DEFAULTS.addCustom === true ? this._defaultAddCustomFn : this._DEFAULTS.addCustom, {
    transform: v => {
      if (isFunction(v)) {
        return v;
      }
      //coerce the value into a boolean
      //if "true", use the default function. Otherwise, just set to "false".
      return coerceBooleanProperty(v) && this._defaultAddCustomFn;
    },
  });
  readonly shouldShowAddCustom = computed<boolean>(
    () => this.addCustom() !== false && this.searchTerm().length > 0 && this.itemStorage.isNoItemsFound()
  );

  async addCustomOption(value: string) {
    const ac = this.addCustom();
    if (!ac) return;

    const newOptionObj = await this.itemStorage.addCustomOption(value, ac);
    if (!newOptionObj) return;

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
  //! change & touch event emitters
  protected _emitChange(): void {
    const value = this.itemStorage.value();
    this._onChangeRegistered?.(value);
    this.changeEvent.emit(value);
    this.valueChange.emit(value);
  }
  private _onTouched(): void {
    this.touched.set(true);
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
  get value(): Signal<any[]> {
    return this.itemStorage.value;
  }
  readonly valueChange = output<any[]>();

  //! output events
  readonly changeEvent = output<any[]>({ alias: 'change' });
  readonly addEvent = output<any[]>({ alias: 'add' });
  readonly failedToAddEvent = output<any[]>({ alias: 'failedToAdd' });
  readonly removeEvent = output<any[]>({ alias: 'remove' });
  readonly clearEvent = output<void>({ alias: 'clear' });
  readonly openEvent = output<void>({ alias: 'open' });
  readonly closeEvent = output<void>({ alias: 'close' });
  readonly scrollEvent = output<{
    start: number;
    end: number;
  }>({ alias: 'scroll' });
  readonly scrollToEndEvent = output({ alias: 'scrollToEnd' });
  readonly searchEvent = output<{
    search: string;
    matching: any[];
  }>({ alias: 'search' });

  readonly isOpen = model<boolean>(false);

  //! view children
  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  readonly dropdownPanel = viewChild<ArdiumDropdownPanelComponent>(ArdiumDropdownPanelComponent);

  //! templates
  readonly optionTemplate = contentChild(ArdOptionTemplateDirective);
  readonly optgroupTemplate = contentChild(ArdOptgroupTemplateDirective);
  readonly valueTemplate = contentChild(ArdValueTemplateDirective);
  readonly placeholderTemplate = contentChild(ArdSelectPlaceholderTemplateDirective);
  readonly loadingSpinnerTemplate = contentChild(ArdLoadingSpinnerTemplateDirective);
  readonly loadingPlaceholderTemplate = contentChild(ArdLoadingPlaceholderTemplateDirective);
  readonly dropdownHeaderTemplate = contentChild(ArdDropdownHeaderTemplateDirective);
  readonly dropdownFooterTemplate = contentChild(ArdDropdownFooterTemplateDirective);
  readonly noItemsFoundTemplate = contentChild(ArdNoItemsFoundTemplateDirective);
  readonly addCustomTemplate = contentChild(ArdAddCustomTemplateDirective);
  readonly itemLimitReachedTemplate = contentChild(ArdItemLimitReachedTemplateDirective);
  readonly itemDisplayLimitTemplate = contentChild(ArdItemDisplayLimitTemplateDirective);

  readonly prefixTemplate = contentChild(ArdSelectPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdSelectSuffixTemplateDirective);

  //! context providers
  getValueContext(item: ArdOption): ValueContext {
    return {
      $implicit: item,
      item,
      itemData: item.itemData(),
      unselect: () => {
        this.unselectItem(item);
      },
    };
  }
  readonly getStatsContext = computed(
    (): StatsContext => ({
      totalItems: this.totalItems(),
      foundItems: this.foundItems(),
    })
  );
  readonly getSearchContext = computed(
    (): SearchContext => ({
      $implicit: this.searchTerm(),
      searchTerm: this.searchTerm(),
      totalItems: this.totalItems(),
      foundItems: this.foundItems(),
    })
  );
  readonly getPlaceholderContext = computed((): PlaceholderContext => {
    const placeholder = this.placeholderForCurrentContext();
    return {
      placeholder,
      $implicit: placeholder,
    };
  });
  readonly getCustomOptionContext = computed(
    (): CustomOptionContext => ({
      $implicit: this.searchTerm(),
      searchTerm: this.searchTerm(),
    })
  );
  getGroupContext(group: ArdOptionGroup): GroupContext {
    return {
      $implicit: group,
      group,
      selectedChildren: group.children().filter(v => v.selected()).length,
      totalChildren: group.children().length,
    };
  }
  getOptionContext(item: ArdOption): OptionContext<ArdOption> {
    return {
      $implicit: item,
      item,
      itemData: item.itemData(),
    };
  }
  readonly getItemLimitContext = computed(
    (): ItemLimitContext => ({
      totalItems: this.totalItems(),
      selectedItems: this.itemStorage.selectedItems().length,
      itemLimit: this.maxSelectedItems(),
    })
  );
  readonly getItemDisplayLimitContext = computed((): ItemDisplayLimitContext => {
    const selectedItems = this.itemStorage.selectedItems().length;
    return {
      totalItems: this.totalItems(),
      selectedItems,
      itemLimit: this.maxSelectedItems(),
      overflowCount: selectedItems - (this.itemDisplayLimit() ?? 0),
    };
  });

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly _cd = inject(ChangeDetectorRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly scrollStrategyOpts = inject(ScrollStrategyOptions);

  //! dropdown overlay
  @ViewChild('dropdownHost', { read: ElementRef })
  dropdownHost!: ElementRef<HTMLDivElement>;
  @ViewChild('dropdownTemplate', { read: TemplateRef })
  dropdownTemplate!: TemplateRef<any>;

  private dropdownOverlay?: OverlayRef;

  private _createOverlay(): void {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.dropdownHost)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
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

  //! hooks
  ngOnInit(): void {
    this._setSearchInputAttributes();
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
  ngAfterViewInit(): void {
    if (this.autoFocus()) {
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
      if (changes['loading'].currentValue === false) {
        this._onItemsLoad();
      }
    }
  }
  private _onItemsLoad() {
    if (!this._searchBarFocused) return;
    this.open();
  }

  //! getters
  readonly firstHighlightedItem = computed<ArdOption | undefined>(() => this.itemStorage.highlightedItems()?.first());
  readonly shouldDisplayPlaceholder = computed<boolean>(() => !this.itemStorage.isAnyItemSelected() && !this.searchTerm());
  readonly shouldDisplayValue = computed<boolean>(
    () => this.itemStorage.isAnyItemSelected() && (!this.searchTerm() || this.multiselectable())
  );
  readonly shouldShowClearButton = computed<boolean>(
    () => this.clearable() && !this.disabled() && (this.itemStorage.isAnyItemSelected() || this.searchTerm() !== '')
  );
  readonly itemsToDisplay = computed<IterableIterator<ArdOptionGroup>>(() => this.itemStorage.groups().values());
  readonly shouldShowNoItemsFound = computed<boolean>(
    () => this.itemStorage.isNoItemsFound() && !this.isLoading() && !this.shouldShowAddCustom()
  );
  readonly totalItems = computed<number>(() => this.itemStorage.items().length);
  readonly foundItems = computed<number | undefined>(() =>
    this.searchable() ? this.itemStorage.filteredItems().length : undefined
  );
  readonly shouldShowItemDisplayLimit = computed<boolean>(
    () =>
      this.multiselectable() &&
      this.itemDisplayLimit() !== Infinity &&
      this.itemStorage.selectedItems().length > this.itemDisplayLimit()
  );
  readonly isInputElementReadonly = computed<boolean>(
    () => !this.addCustom() && (!this.searchable() || this.itemStorage.isItemLimitReached())
  );

  isValueWithinDisplayLimit(i: number): boolean {
    return !this.multiselectable() || this.itemDisplayLimit() === Infinity || i < this.itemDisplayLimit();
  }
  readonly placeholderForCurrentContext = computed<string>(() => {
    if (this.searchPlaceholder() && this.searchable() && (this._searchBarFocused() || this._isClickedWithin()))
      return this.searchPlaceholder();
    return this.placeholder();
  });

  //! search input event handlers
  filter(filterTerm: string, suppressSearchEvent = false): void {
    this.searchTerm.set(filterTerm);
    const matching = this.itemStorage.filter(filterTerm);
    if (!suppressSearchEvent) this.searchEvent.emit({ search: filterTerm, matching });
    this.open();
  }
  onSearchInputFocus(): void {
    this._searchBarFocused.set(true);
  }
  onSearchInputBlur(): void {
    if (!this._searchBarFocused()) return;

    this._onTouched();

    this._searchBarFocused.set(false);
  }
  //! item selection handlers
  toggleItem(item: ArdOption): void {
    if (item.selected()) {
      this.unselectItem(item);
      return;
    }
    this.selectItem(item);
  }
  selectItem(...items: ArdOption[]): void {
    const [selected, unselected, failedToSelect] = this.itemStorage.selectItem(...items);

    if (unselected.length > 0) {
      this.removeEvent.emit(unselected);
    }
    if (failedToSelect.length > 0) {
      this.failedToAddEvent.emit(failedToSelect);
    }
    if (selected.length > 0) {
      this.addEvent.emit(selected);

      this.focus();
      if (!this.keepSearchAfterSelect()) this._clearSearch(true);

      if (!this.keepOpen() || this.itemStorage.isNoItemsToSelect()) {
        this.close();
      }
    }
    if (unselected.length > 0 || selected.length > 0) {
      this._emitChange();
    }
  }
  unselectItem(...items: ArdOption[]): void {
    const unselected = this.itemStorage.unselectItem(...items);

    this.removeEvent.emit(unselected);
    this._emitChange();
    if (!this.keepSearchAfterSelect()) this._clearSearch();

    this.focus();

    if (!this.keepOpen() || this.itemStorage.isNoItemsToSelect()) {
      this.close();
    }
  }
  private _clearAllItems(): void {
    const cleared = this.itemStorage.clearAllSelected(true);

    this.focus();

    this.clearEvent.emit();
    this.removeEvent.emit(cleared);
    this._emitChange();
  }
  private _clearLastItem(): void {
    const clearedValue = this.itemStorage.clearLastSelected().value();

    this.focus();

    this.removeEvent.emit([clearedValue]);
    this._emitChange();
  }
  //! highligh-related
  onMouseMove() {
    this._isMouseBeingUsed.set(true);
  }
  onGroupMouseover(group: ArdOptionGroup): void {
    if (!this.multiselectable() || this.noGroupActions()) return;
    this.itemStorage.highlightGroup(group);
  }
  onItemMouseOver(event: MouseEvent): void {
    event.stopPropagation();
  }
  onItemMouseEnter(option: ArdOption, event: MouseEvent): void {
    if (!this._isMouseBeingUsed()) return;
    this.itemStorage.highlightSingleItem(option);
    event.stopPropagation();
  }
  onItemMouseLeave(option: ArdOption, event: MouseEvent): void {
    if (!this._isMouseBeingUsed()) return;
    this.itemStorage.unhighlightItem(option);
    event.stopPropagation();
  }
  //! click handlers
  private readonly _isClickedWithin = signal<boolean>(false);
  onItemClick(option: ArdOption, event: MouseEvent): void {
    event.stopPropagation();
    if (this.clearable()) this.toggleItem(option);
    else this.selectItem(option);

    this._isClickedWithin.set(true);
  }
  onGroupClick(group: ArdOptionGroup): void {
    if (!this.multiselectable() || this.noGroupActions()) return;
    if (group.children().every(o => o.selected)) {
      this.unselectItem(...group.children());
      return;
    }
    this.selectItem(...group.children());

    this._isClickedWithin.set(true);
  }
  handleClearButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.searchTerm()) {
      this._clearSearch();
      return;
    }
    this._clearAllItems();
  }
  handleDropdownArrowClick(event: MouseEvent): void {
    event.stopPropagation();

    this._isClickedWithin.set(true);

    this.toggle();
  }
  handleOutsideClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as HTMLElement;
    if (this.elementRef.nativeElement.contains(target)) return;

    this.close();
  }
  handleAnywhereClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT') {
      event.preventDefault();
    }

    this._isClickedWithin.set(true);

    if (!this._searchBarFocused()) {
      this.focus();
    }

    if (this.searchable()) {
      this.open();
    } else {
      this.toggle();
    }
  }
  @HostListener('mouseup')
  onMouseup(): void {
    this._isClickedWithin.set(false);
  }
  //! dropdown state handlers
  toggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }
    this.open();
  }
  open(): void {
    if (this.disabled() || this.isOpen()) return;

    this.isOpen.set(true);
    if (this.autoHighlightFirst()) this.itemStorage.highlightFirstItem();

    this._createOverlay();
    this.focus();

    this.openEvent.emit();
    this.detectChanges();
  }
  close(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);

    this._destroyOverlay();

    this._onTouched();
    this.closeEvent.emit();
    this._cd.markForCheck();
  }
  //! ChangeDetectorRef
  detectChanges(): void {
    if (!(this._cd as any).destroyed) {
      this._cd.detectChanges();
    }
  }
  //! search
  private _clearSearch(suppressSearchEvent = false): void {
    this._setSearch('', suppressSearchEvent);
  }
  private _setSearch(searchTerm: string, suppressSearchEvent = false): void {
    this.searchTerm.set(searchTerm);
    this.filter(searchTerm, suppressSearchEvent);
  }
  private _setSearchInputAttributes() {
    const input = this.searchInput()!.nativeElement;
    const attributes: Record<string, string> = {
      type: 'text',
      autocorrect: 'off',
      autocapitalize: 'off',
      autocomplete: 'off',
      ...this.inputAttrs(),
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
          this._onCtrlAPress();
          return;
        }
      }
    }
  }
  private async _onEnterPress(event: KeyboardEvent) {
    event.preventDefault();
    let shouldClose = true;

    //select the currently highlighted option
    if (this.isOpen() && this.firstHighlightedItem()) {
      if (this.clearable() && this.itemStorage.highlightedItems().every(item => item.selected)) {
        this.unselectItem(...this.itemStorage.highlightedItems());
      } else {
        this.selectItem(...this.itemStorage.highlightedItems());
      }
    }
    //add a custom option
    else if (this.isOpen() && this.shouldShowAddCustom()) {
      await this.addCustomOption(this.searchTerm());
    }
    //in case of no action, open the dropdown (or keep it open)
    else shouldClose = false;

    if (!this.keepOpen() && shouldClose) {
      this.itemStorage.clearAllHighlights();
      this.close();
    } else {
      this.open();
    }
  }
  private _onSpacePress(event: KeyboardEvent): void {
    if (this.isOpen()) return;

    event.preventDefault();
    this.open();
  }
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.open();

    this._isMouseBeingUsed.set(false);

    const recentlyHighlighted = this.itemStorage.highlightNextItem(+1, event.shiftKey);
    if (recentlyHighlighted) {
      this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
    }

    this.dropdownPanel()?.scrollToRecentlyHighlighted('bottom');
  }
  private _onArrowUpPress(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    event.preventDefault();

    this._isMouseBeingUsed.set(false);

    const recentlyHighlighted = this.itemStorage.highlightNextItem(-1, event.shiftKey);
    if (recentlyHighlighted) {
      this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
    }

    this.dropdownPanel()?.scrollToRecentlyHighlighted('top');
  }
  private _onHomePress(event: KeyboardEvent): void {
    if (
      !this.isOpen() ||
      (this.searchInput()?.nativeElement.selectionEnd !== 0 && this.searchInput()?.nativeElement.selectionStart !== 0)
    )
      return;
    event.preventDefault();

    this._isMouseBeingUsed.set(false);

    const recentlyHighlighted = this.itemStorage.highlightFirstItem();
    if (!recentlyHighlighted) return;

    this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
    this.dropdownPanel()?.scrollToRecentlyHighlighted('top');
  }
  private _onEndPress(event: KeyboardEvent): void {
    if (
      !this.isOpen() ||
      (this.searchInput()?.nativeElement.selectionEnd !== this.searchTerm().length &&
        this.searchInput()?.nativeElement.selectionStart !== this.searchTerm().length)
    )
      return;
    event.preventDefault();

    this._isMouseBeingUsed.set(false);

    const recentlyHighlighted = this.itemStorage.highlightLastItem();
    if (!recentlyHighlighted) return;

    this.itemStorage.setRecentlyHighlighted(recentlyHighlighted);
    this.dropdownPanel()?.scrollToRecentlyHighlighted('bottom');
  }
  private _onBackspaceOrDeletePress(event: KeyboardEvent): void {
    if (this.searchTerm() || !this.clearable() || this.noBackspaceClear() || !this.itemStorage.isAnyItemSelected()) return;

    event.preventDefault();
    if (this.multiselectable() && this.itemStorage.selectedItems().length > 1) {
      this._clearLastItem();
      return;
    }
    this._clearAllItems();
  }
  private _onCtrlAPress(): void {
    this.itemStorage.highlightAllItems();
  }
}
