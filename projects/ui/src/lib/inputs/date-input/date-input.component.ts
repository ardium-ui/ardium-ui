import { Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
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
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { isDefined, isNull } from 'simple-bool';
import { _FormFieldComponentBase } from '../../_internal/form-field-component';
import { ArdiumDropdownPanelComponent, DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel';
import { ComponentColor } from '../../types/colors.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import { ARD_DATE_INPUT_DEFAULTS, ArdDateInputDefaults } from './date-input.defaults';
import {
  ArdSelectPrefixTemplateDirective,
  ArdSelectSuffixTemplateDirective,
  ArdValueTemplateDirective,
} from './date-input.directive';
import { ArdDateInputDeserializeFn, ArdDateInputSerializeFn, ValueContext } from './date-input.types';

@Component({
  selector: 'ard-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumDateInputComponent),
      multi: true,
    },
    {
      provide: _FormFieldComponentBase,
      useExisting: ArdiumDateInputComponent,
    },
  ],
})
export class ArdiumDateInputComponent extends _FormFieldComponentBase implements OnInit, OnDestroy, ControlValueAccessor {
  protected override readonly _DEFAULTS!: ArdDateInputDefaults;
  constructor(@Inject(ARD_DATE_INPUT_DEFAULTS) defaults: ArdDateInputDefaults) {
    super(defaults);
  }

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly scrollStrategyOpts = inject(ScrollStrategyOptions);

  readonly inputAttrs = input<Record<string, any>>(this._DEFAULTS.inputAttrs);

  readonly placeholder = input<string>(this._DEFAULTS.placeholder);

  readonly inputReadOnly = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly calendarDisabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly calendarHidden = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! serialization/deserialization
  readonly serializeFn = input<ArdDateInputSerializeFn>(this._DEFAULTS.serializeFn);
  readonly deserializeFn = input<ArdDateInputDeserializeFn>(this._DEFAULTS.deserializeFn);

  //! control value accessor
  readonly value = model<Date | null>(null);
  readonly dateInputValue = model<string>('');

  writeValue(v: Date | null): void {
    if (v instanceof Date) {
      this.value.set(v);
    } else if (!isDefined(v)) {
      this.value.set(null);
    } else {
      console.error(new Error(`ARD-NF2003: <ard-date-input> writeValue expected a Date or null, got "${v}".`));
    }
  }

  //! change & touch event emitters
  protected _emitChange(): void {
    this._onChangeRegistered?.(this.value());
  }
  private _onTouched(): void {
    this._onTouchedRegistered?.();
  }

  //! output events
  readonly isOpen = model<boolean>(false);

  readonly openEvent = output<void>({ alias: 'open' });
  readonly closeEvent = output<void>({ alias: 'close' });

  //! date input event handlers
  readonly dateInput = viewChild.required<ElementRef<HTMLInputElement>>('dateInput');

  private readonly _isDateInputFocused = signal<boolean>(false);

  onDateInputInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.dateInputValue.set(v);
  }
  onDateInputFocus(event: FocusEvent): void {
    this.onFocus(event);
    this._isDateInputFocused.set(true);
  }
  onDateInputBlur(event: FocusEvent): void {
    this.onBlur(event);

    this._processDateInputText(this.dateInputValue());

    if (!this._isDateInputFocused()) return;

    this._onTouched();

    this._isDateInputFocused.set(false);
  }
  private _processDateInputText(value: string): void {
    const date = this.deserializeFn()(value, this.value());
    if (date instanceof Date) {
      this.value.set(date);
      this.dateInputValue.set(this.serializeFn()(date));
    } else {
      this.value.set(null);
      this.dateInputValue.set(value);
    }
  }
  private _setDateInputAttributes() {
    const input = this.dateInput()!.nativeElement;
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

  //! computed properties
  readonly shouldDisplayPlaceholder = computed(() => {
    if (this._isDateInputFocused() && this.dateInputValue()) return false;
    return isNull(this.value());
  });
  readonly shouldDisplayValue = computed(() => {
    if (this._isDateInputFocused() && this.dateInputValue()) return false;
    return this.value() instanceof Date;
  });

  //! appearance
  readonly appearance = input<FormElementAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<FormElementVariant>(this._DEFAULTS.variant);
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      //appearance and variant handled in ard-form-field-frame component
      this.compact() ? 'ard-compact' : '',
      this.isOpen() ? 'ard-dropdown-open' : '',
      this._isDateInputFocused() ? 'ard-datepicker__date-input-focused' : '',
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

  //! dropdown overlay
  readonly dropdownHost = viewChild.required<ElementRef<HTMLElement>>('dropdownHost');
  readonly dropdownTemplate = viewChild.required<TemplateRef<any>>('dropdownTemplate');
  readonly dropdownPanel = viewChild.required<ArdiumDropdownPanelComponent>(ArdiumDropdownPanelComponent);

  private dropdownOverlay?: OverlayRef;

  private _createOverlay(): void {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.dropdownHost())
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

    const portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);
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

    const rect = this.dropdownHost().nativeElement.getBoundingClientRect();
    this.dropdownOverlay.updateSize({ width: rect.width });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.setOverlaySize();
  }

  //! hooks
  override ngOnInit(): void {
    super.ngOnInit();
    this._setDateInputAttributes();
  }

  //! dropdown state handlers
  onGeneralClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT') {
      event.preventDefault();
    }

    if (this.isOpen()) {
      this.close();
    }
    this.dateInput().nativeElement.focus();
  }
  onOutsideClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as HTMLElement;
    if (this.elementRef.nativeElement.contains(target)) return;

    this.close();
  }
  onCalendarButtonClick(): void {
    if (this.calendarDisabled()) return;
    if (this.calendarHidden()) return;

    this.toggle();
  }

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

    this._createOverlay();
    this.focus();

    this.openEvent.emit();
  }
  close(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);

    this._destroyOverlay();

    this._onTouched();
    this.closeEvent.emit();
  }

  //! templates
  readonly valueTemplate = contentChild(ArdValueTemplateDirective);

  readonly prefixTemplate = contentChild(ArdSelectPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdSelectSuffixTemplateDirective);

  //! context providers
  getValueContext(): ValueContext {
    return {
      $implicit: this.value(),
    };
  }
}
