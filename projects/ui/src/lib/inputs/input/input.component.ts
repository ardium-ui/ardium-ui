import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceArrayProperty, coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '@ardium-ui/ui';
import { isString } from 'simple-bool';
import { SimplestItemStorage, SimplestItemStorageHost } from '../../_internal/item-storages/simplest-item-storage';
import { _NgModelComponentBaseWithDefaults } from '../../_internal/ngmodel-component';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel/dropdown-panel.types';
import { ArdSimplestStorageItem } from '../../types/item-storage.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import { OptionContext } from './../../types/item-storage.types';
import { InputModel, InputModelHost, escapeAndCreateRegex } from './../input-utils';
import { ARD_INPUT_DEFAULTS, ArdInputDefaults } from './input.defaults';
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
  extends _NgModelComponentBaseWithDefaults
  implements InputModelHost, SimplestItemStorageHost, AfterViewInit
{
  private readonly overlay = inject(Overlay);
  private readonly scrollStrategyOpts = inject(ScrollStrategyOptions);
  private readonly viewContainerRef = inject(ViewContainerRef);

  protected override readonly _DEFAULTS!: ArdInputDefaults;
  public readonly DEFAULTS!: ArdInputDefaults;
  constructor(@Inject(ARD_INPUT_DEFAULTS) defaults: ArdInputDefaults) {
    super(defaults);

    this.DEFAULTS = this._DEFAULTS;
  }

  //! input view
  readonly textInputEl = viewChild<ElementRef<HTMLInputElement>>('textInput');

  readonly placeholder = input<string>(this._DEFAULTS.placeholder);
  readonly inputId = input<Nullable<string>>(undefined);
  readonly clearButtonTitle = input<string>(this._DEFAULTS.clearButtonTitle);

  readonly shouldDisplayPlaceholder = computed<boolean>(() => Boolean(this.placeholder()) && !this.inputModel.value());

  //! appearance
  readonly appearance = input<FormElementAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<FormElementVariant>(this._DEFAULTS.variant);
  readonly alignText = input<SimpleOneAxisAlignment>(this._DEFAULTS.alignText);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed((): string =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-text-align-${this.alignText()}`,
      this.compact() ? 'ard-compact' : '',
      this.clearable() ? 'ard-clearable' : '',
    ].join(' ')
  );

  //! other inputs
  readonly inputAttrs = input<Record<string, any>>(this._DEFAULTS.inputAttrs);

  //! number attribute setters/getters
  readonly maxLength = input<Nullable<number>, any>(this._DEFAULTS.maxLength, {
    transform: v => coerceNumberProperty(v, this._DEFAULTS.maxLength),
  });

  //! no-value attribute setters/getters
  readonly clearable = input<boolean, any>(this._DEFAULTS.clearable, { transform: v => coerceBooleanProperty(v) });

  //! control value accessor's write value implementation
  writeValue(v: any) {
    this.inputModel.writeValue(v);
  }
  //! value two-way binding
  protected _valueBeforeInit?: string | null = null;
  @Input()
  set value(v: string | null) {
    if (!this._wasViewInit) {
      this._valueBeforeInit = v;
      return;
    }
    this.writeValue(v);
  }
  get value(): string | null {
    return this.inputModel.value();
  }
  readonly valueChange = output<string | null>();

  //! event emitters
  readonly inputEvent = output<string | null>({ alias: 'input' });
  readonly changeEvent = output<string | null>({ alias: 'change' });
  readonly clearEvent = output<MouseEvent>({ alias: 'clear' });

  //! event handlers
  onInput(newVal: string): void {
    const valueHasChanged = this.inputModel.writeValue(newVal);
    if (!valueHasChanged) return;
    this._emitInput();
  }
  protected _emitInput(): void {
    this._onChangeRegistered?.(this.value);
    this.inputEvent.emit(this.value);
    this.valueChange.emit(this.value);
  }
  //focus, blur, change
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
    this.changeEvent.emit(this.inputModel.value());
  }
  // clear button
  readonly shouldShowClearButton = computed<boolean>(
    () => this.clearable() && !this.disabled() && Boolean(this.inputModel.value())
  );
  onClearButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.inputModel.clear();
    this._emitChange();
    this._emitInput();
    this.clearEvent.emit(event);
    this.focus();
  }

  //! copy event
  onCopy(event: ClipboardEvent): void {
    if (
      this.value &&
      //does the selection cover the entire input
      ((this.textInputEl()?.nativeElement.selectionStart === 0 &&
        this.textInputEl()?.nativeElement.selectionEnd === this.textInputEl()?.nativeElement.value.length) ||
        //or is zero-wide
        this.textInputEl()?.nativeElement.selectionStart === this.textInputEl()?.nativeElement.selectionEnd)
    ) {
      event.clipboardData?.setData('text/plain', this.value);
      event.preventDefault();
    }
  }
  //! helpers
  protected _setInputAttributes() {
    const input = this.textInputEl()!.nativeElement;
    const attributes: Record<string, string> = {
      type: 'text',
      autocorrect: 'off',
      autocapitalize: 'off',
      autocomplete: 'off',
      tabindex: String(this.tabIndex()),
      ...this.inputAttrs(),
    };

    for (const key of Object.keys(attributes)) {
      input.setAttribute(key, String(attributes[key]));
    }
  }
  //! input view
  protected readonly inputModel = new InputModel(this);

  //! allowlist/denylist of characters
  //use standard string for denylist, prepend with ^ for allowlist
  readonly charlistFromInput = input<RegExp | undefined, string>(undefined, {
    alias: 'charlist',
    transform: v => {
      if (!isString(v)) {
        throw new Error('ARD-FT0033: [charlist] must be a non-empty string, got "".');
      }
      const negated = v.startsWith('^');
      return escapeAndCreateRegex(v, '', !negated);
    },
  });
  readonly charlistCaseInsensitive = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly charlist = computed<RegExp | undefined>(() => {
    const c = this.charlistFromInput();
    if (!this.charlistCaseInsensitive() || !c) {
      return c;
    }
    return new RegExp(c.source, 'i');
  });

  //! autocomplete
  readonly autocomplete = input<Nullable<string>>(undefined);

  readonly shouldDisplayAutocomplete = computed<boolean>(() => !this.disabled() && Boolean(this.autocomplete()));

  //autocomplete event
  readonly acceptAutocompleteEvent = output({ alias: 'acceptAutocomplete' });

  //! prefix & suffix
  readonly prefixTemplate = contentChild(ArdInputPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdInputSuffixTemplateDirective);

  //! placeholder
  readonly placeholderTemplate = contentChild(ArdInputPlaceholderTemplateDirective);

  //! suggestions
  readonly suggestionStorage = new SimplestItemStorage(this);

  readonly valueFrom = input<Nullable<string>>(undefined, { alias: 'suggValueFrom' });
  readonly labelFrom = input<Nullable<string>>(undefined, { alias: 'suggLabelFrom' });

  readonly acceptSuggestionEvent = output<any>({ alias: 'acceptSuggestion' });

  readonly suggestionItems = this.suggestionStorage.items;

  @Input()
  set suggestions(value: any) {
    if (!Array.isArray(value)) value = coerceArrayProperty(value);

    const shouldPrintErrors = this.suggestionStorage.setItems(value);

    this._suggestionDropdowOpen.set(true);
    this.suggestionStorage.highlightFirstItem();

    if (shouldPrintErrors) {
      this._printPrimitiveWarnings();
    }
  }

  private _printPrimitiveWarnings() {
    function makeWarning(str: string): void {
      console.warn(
        `ARD-WA0031: Skipped using [${str}] property bound to <ard-input>, as some provided suggestion items are of primitive type`
      );
    }
    if (this.valueFrom()) {
      makeWarning('valueFrom');
    }
    if (this.labelFrom()) {
      makeWarning('labelFrom');
    }
  }

  private readonly _suggestionDropdowOpen = signal<boolean>(false);

  readonly shouldDisplaySuggestions = computed(
    () => !this.disabled() && (this.suggestionItems().length > 0 || this.areSuggestionsLoading()) && this._suggestionDropdowOpen()
  );

  readonly areSuggestionsLoading = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly suggestionsLoadingText = input<string>(this.DEFAULTS.suggestionsLoadingText);

  readonly suggestionTemplate = contentChild(ArdSuggestionTemplateDirective);
  readonly suggestionLoadingTemplate = contentChild(ArdInputLoadingTemplateDirective);

  //! suggestions overlay
  readonly dropdownHost = viewChild<ElementRef<HTMLDivElement>>('suggestionsHost');
  readonly dropdownTemplate = viewChild('suggestionsTemplate', { read: TemplateRef });

  private dropdownOverlay!: OverlayRef;

  private _wasViewInit = false;
  ngAfterViewInit(): void {
    this._wasViewInit = true;
    this._setInputAttributes();
    //set the value
    if (this._valueBeforeInit) {
      this.writeValue(this._valueBeforeInit);
      delete this._valueBeforeInit;
    }

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.dropdownHost()!)
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

    const portal = new TemplatePortal(this.dropdownTemplate()!, this.viewContainerRef);
    this.dropdownOverlay.attach(portal);

    this.setOverlaySize();
  }

  setOverlaySize(): void {
    const rect = this.dropdownHost()?.nativeElement.getBoundingClientRect();
    this.dropdownOverlay.updateSize({ width: rect?.width });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.setOverlaySize();
  }

  getOptionContext(item: ArdSimplestStorageItem): OptionContext<ArdSimplestStorageItem> {
    return {
      $implicit: item,
      item,
      itemData: item.itemData,
    };
  }

  //! suggestion-highligh-related
  private _isMouseBeingUsed = false;
  @HostListener('mousemove')
  onMouseMove() {
    this._isMouseBeingUsed = true;
  }
  onSuggestionMouseEnter(item: ArdSimplestStorageItem, event: MouseEvent): void {
    if (!this._isMouseBeingUsed) return;
    this.suggestionStorage.highlightItem(item);

    event.stopPropagation();
  }
  onSuggestionMouseLeave(item: ArdSimplestStorageItem, event: MouseEvent): void {
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

    this.acceptSuggestionEvent.emit(selected);

    //important to do those two things in this exact order
    this.focus();
    this._suggestionDropdowOpen.set(false);
  }
  handleSuggestionClickOutside(event: MouseEvent): void {
    if (!this.shouldDisplaySuggestions()) return;

    const target = event.target as HTMLElement;
    if (this.viewContainerRef.element.nativeElement.contains(target)) return;

    this._suggestionDropdowOpen.set(false);
  }
  //! suggestion appearance
  readonly dropdownAppearance = input<Nullable<DropdownPanelAppearance>>(undefined);
  readonly dropdownAppearanceOrDefault = computed(() => {
    if (this.dropdownAppearance()) return this.dropdownAppearance()!;
    if (this.appearance() === FormElementAppearance.Outlined) return DropdownPanelAppearance.Outlined;
    return DropdownPanelAppearance.Raised;
  });
  readonly dropdownVariant = input<Nullable<DropdownPanelVariant>>(undefined);
  readonly dropdownVariantOrDefault = computed(() => {
    if (this.dropdownVariant()) return this.dropdownVariant()!;
    const variant = this.variant();
    if (variant === FormElementVariant.Pill) return DropdownPanelVariant.Rounded;
    return variant;
  });

  //! focus override
  override onFocus(event: FocusEvent): void {
    this._suggestionDropdowOpen.set(true);
    if (!this.suggestionStorage.highlightedItem()) this.suggestionStorage.highlightFirstItem();

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
    if (!this.shouldDisplayAutocomplete()) return;
    event.preventDefault();

    this.onInput(this.autocomplete() ?? '');
    this.acceptAutocompleteEvent.emit();
  }
  private _onEnterPress(event: KeyboardEvent): void {
    if (!this.shouldDisplaySuggestions()) return;
    const item = this.suggestionStorage.highlightedItem();
    if (!item) return;

    event.preventDefault();
    this._selectSuggestion(item);
  }
  private _onArrowDownPress(event: KeyboardEvent): void {
    if (!this.shouldDisplaySuggestions()) return;
    event.preventDefault();

    this._isMouseBeingUsed = false;

    this.suggestionStorage.highlightNextItem(+1);
  }
  private _onArrowUpPress(event: KeyboardEvent): void {
    if (!this.shouldDisplaySuggestions()) return;
    event.preventDefault();

    this._isMouseBeingUsed = false;

    this.suggestionStorage.highlightNextItem(-1);
  }
}
