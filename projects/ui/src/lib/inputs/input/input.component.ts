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
import { coerceArrayProperty, coerceBooleanProperty } from '@ardium-ui/devkit';
import { isString } from 'simple-bool';
import { SimplestItemStorage, SimplestItemStorageHost } from '../../_internal/item-storages/simplest-item-storage';
import { DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel/dropdown-panel.types';
import { ArdSimplestStorageItem } from '../../types/item-storage.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import { _SimpleInputComponentBase } from '../_simple-input-base';
import { OptionContext } from './../../types/item-storage.types';
import { InputModel, InputModelHost, escapeAndCreateRegex } from './../input-utils';
import { ARD_INPUT_DEFAULTS, ArdInputDefaults } from './input.defaults';
import {
  ArdInputLoadingTemplateDirective,
  ArdInputPlaceholderTemplateDirective,
  ArdInputPrefixTemplateDirective,
  ArdInputSuffixTemplateDirective,
  ArdInputSuggestionTemplateDirective,
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
  extends _SimpleInputComponentBase
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
  protected override readonly inputModel = new InputModel(this);

  //! allowlist/denylist of characters
  //use standard string for denylist, prepend with ^ for allowlist
  readonly charlistFromInput = input<RegExp | undefined, string>(
    this._DEFAULTS.charlist
      ? escapeAndCreateRegex(this._DEFAULTS.charlist, '', this._DEFAULTS.charlist.startsWith('^'))
      : undefined,
    {
      alias: 'charlist',
      transform: v => {
        if (!isString(v)) {
          throw new Error('ARD-FT0033: [charlist] must be a non-empty string, got "".');
        }
        const negated = v.startsWith('^');
        return escapeAndCreateRegex(v, '', !negated);
      },
    }
  );
  readonly charlistCaseInsensitive = input<boolean, any>(this._DEFAULTS.charlistCaseInsensitive, {
    transform: v => coerceBooleanProperty(v),
  });

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
  override readonly prefixTemplate = contentChild(ArdInputPrefixTemplateDirective);
  override readonly suffixTemplate = contentChild(ArdInputSuffixTemplateDirective);

  //! placeholder
  override readonly placeholderTemplate = contentChild(ArdInputPlaceholderTemplateDirective);

  //! suggestions
  readonly suggestionStorage = new SimplestItemStorage(this);

  readonly valueFrom = input<Nullable<string>>(this._DEFAULTS.suggLabelFrom, { alias: 'suggValueFrom' });
  readonly labelFrom = input<Nullable<string>>(this._DEFAULTS.suggLabelFrom, { alias: 'suggLabelFrom' });

  readonly acceptSuggestionEvent = output<any>({ alias: 'acceptSuggestion' });

  readonly suggestionItems = this.suggestionStorage.items;

  @Input()
  set suggestions(value: any) {
    if (!Array.isArray(value)) value = coerceArrayProperty(value);

    this.suggestionStorage.setItems(value);

    this._suggestionDropdowOpen.set(true);
    this.suggestionStorage.highlightFirstItem();
  }

  private readonly _suggestionDropdowOpen = signal<boolean>(false);

  readonly shouldDisplaySuggestions = computed(
    () => !this.disabled() && (this.suggestionItems().length > 0 || this.areSuggestionsLoading()) && this._suggestionDropdowOpen()
  );

  readonly areSuggestionsLoading = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly suggestionsLoadingText = input<string>(this._DEFAULTS.suggestionsLoadingText);

  readonly suggestionTemplate = contentChild(ArdInputSuggestionTemplateDirective);
  readonly suggestionLoadingTemplate = contentChild(ArdInputLoadingTemplateDirective);

  //! suggestions overlay
  readonly dropdownHost = viewChild<ElementRef<HTMLDivElement>>('suggestionsHost');
  readonly dropdownTemplate = viewChild('suggestionsTemplate', { read: TemplateRef });

  private dropdownOverlay!: OverlayRef;

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

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

  @HostListener('window:resize')
  setOverlaySize(): void {
    const rect = this.dropdownHost()?.nativeElement.getBoundingClientRect();
    this.dropdownOverlay.updateSize({ width: rect?.width });
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
