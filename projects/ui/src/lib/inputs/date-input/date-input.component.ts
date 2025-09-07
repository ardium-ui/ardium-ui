import { Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  Inject,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceDateProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isDefined, isNull } from 'simple-bool';
import { _FormFieldComponentBase } from '../../_internal/form-field-component';
import { ArdCalendarFilterFn, ArdCalendarView } from '../../calendar/calendar.types';
import { ArdiumDropdownPanelComponent, DropdownPanelAppearance, DropdownPanelVariant } from '../../dropdown-panel';
import { ARD_FORM_FIELD_CONTROL } from '../../form-field/form-field-child.token';
import { ComponentColor } from '../../types/colors.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import { ARD_DATE_INPUT_DEFAULTS, ArdDateInputDefaults } from './date-input.defaults';
import {
  ArdDateInputAcceptButtonsTemplateDirective,
  ArdDateInputCalendarIconTemplateDirective,
  ArdDateInputDaysViewHeaderTemplateDirective,
  ArdDateInputDayTemplateDirective,
  ArdDateInputFloatingMonthTemplateDirective,
  ArdDateInputMonthsViewHeaderTemplateDirective,
  ArdDateInputMonthTemplateDirective,
  ArdDateInputPrefixTemplateDirective,
  ArdDateInputSuffixTemplateDirective,
  ArdDateInputValueTemplateDirective,
  ArdDateInputWeekdayTemplateDirective,
  ArdDateInputYearsViewHeaderTemplateDirective,
  ArdDateInputYearTemplateDirective,
} from './date-input.directive';
import {
  ArdDateInputAcceptButtonsContext,
  ArdDateInputDeserializeFn,
  ArdDateInputMinMaxStrategy,
  ArdDateInputSerializeFn,
  ArdDateInputValueContext,
} from './date-input.types';

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
      provide: ARD_FORM_FIELD_CONTROL,
      useExisting: ArdiumDateInputComponent,
    },
  ],
})
export class ArdiumDateInputComponent extends _FormFieldComponentBase implements OnDestroy, ControlValueAccessor, AfterViewInit {
  protected override readonly _DEFAULTS!: ArdDateInputDefaults;
  constructor(@Inject(ARD_DATE_INPUT_DEFAULTS) defaults: ArdDateInputDefaults) {
    super(defaults);

    effect(
      () => {
        this.value();
        this._emitChange();
        this._serializeValueIntoDateInput();
      },
      { allowSignalWrites: true }
    );
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
  private readonly _wasDateInputChanged = signal<boolean>(false);

  writeValue(v: Date | null): void {
    if (v instanceof Date) {
      this.value.set(v);
    } else if (!isDefined(v)) {
      this.value.set(null);
    } else {
      console.error(new Error(`ARD-NF0083: <ard-date-input> writeValue expected a Date or null, got "${v}".`));
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

  readonly minMaxStrategy = input<ArdDateInputMinMaxStrategy>(this._DEFAULTS.minMaxStrategy);

  private readonly _isDateInputFocused = signal<boolean>(false);

  onDateInputInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.dateInputValue.set(v);
  }
  onDateInputFocus(event: FocusEvent): void {
    this.onFocus(event);
    this._isDateInputFocused.set(true);
    this._wasDateInputChanged.set(false);
  }
  onDateInputBlur(event: FocusEvent): void {
    this.onBlur(event);

    this._processDateInputText(this.dateInputValue());

    if (!this._isDateInputFocused()) return;

    this._onTouched();

    this._isDateInputFocused.set(false);
  }
  onDateInputEnter(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    this.close();
    this.blur();
    this.focus();
  }
  private _processDateInputText(value: string): void {
    let date = this.deserializeFn()(value, this.value());

    if (this.minMaxStrategy() === ArdDateInputMinMaxStrategy.Adjust && date) {
      const min = this.min();
      const max = this.max();

      if (min && date < min) {
        date = new Date(min);
      } else if (max && date > max) {
        date = new Date(max);
      }
    }

    this.value.set(date);
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
    if (this._isDateInputFocused()) return false;
    return this.value() instanceof Date;
  });
  readonly shouldDisplayDateInput = computed(() => {
    return !this.inputReadOnly() && !this.shouldDisplayValue() && this._isDateInputFocused();
  });

  //! appearance
  readonly appearance = input<FormElementAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<FormElementVariant>(this._DEFAULTS.variant);
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly compact = input<boolean, any>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      //appearance and variant handled in ard-form-field-frame component
      //color handled in ard-calendar component
      this.compact() ? 'ard-compact' : '',
      this.isOpen() ? 'ard-dropdown-open' : '',
      this._isDateInputFocused() ? 'ard-date-input__date-input-focused' : '',
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

  //! calendar attributes
  readonly activeView = model<ArdCalendarView>(this._DEFAULTS.activeView);
  readonly activeYear = model<number>(this._DEFAULTS.activeYear);
  readonly activeMonth = model<number>(this._DEFAULTS.activeMonth);

  readonly firstWeekday = input<number, any>(this._DEFAULTS.firstWeekday, {
    transform: v => {
      const value = coerceNumberProperty(v, this._DEFAULTS.firstWeekday);
      if (!Number.isInteger(value)) {
        console.error(
          new Error(`ARD-NF0081A: [firstWeekday] must be a positive integer, got "${value}". Using default value instead.`)
        );
        return 1;
      }
      if (value < 0 || value > 6) {
        console.error(
          new Error(
            `ARD-WA0081B: [firstWeekday] must be between 0 and 6, got "${value}". Using modulo operator to adjust the value.`
          )
        );
      }
      return value % 7;
    },
  });

  readonly multipleYearPageChangeModifier = input<number, any>(this._DEFAULTS.multipleYearPageChangeModifier, {
    transform: v => {
      const value = coerceNumberProperty(v, this._DEFAULTS.multipleYearPageChangeModifier);
      if (!Number.isInteger(value) || value < 1) {
        console.error(
          new Error(
            `ARD-NF0082: [multipleYearPageChangeModifier] must be a positive integer, got "${value}". Using default value instead.`
          )
        );
        return 5;
      }
      return value;
    },
  });

  readonly min = input<Date | null, any>(this._DEFAULTS.min, { transform: v => coerceDateProperty(v, this._DEFAULTS.min) });
  readonly max = input<Date | null, any>(this._DEFAULTS.max, { transform: v => coerceDateProperty(v, this._DEFAULTS.max) });

  readonly filter = input<ArdCalendarFilterFn | null>(this._DEFAULTS.filter);

  //! calendar outputs
  readonly yearSelect = output<number>();
  readonly monthSelect = output<number>();

  //! calendar controls
  readonly useAcceptButtonToSelect = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  private _valueToAccept: Date | null = null;

  onCalendarSelectedChange(event: Date | null): void {
    if (this.useAcceptButtonToSelect()) {
      this._valueToAccept = event;
      return;
    }
    this._acceptSelectedDate(event!);
  }
  private _acceptSelectedDate(date: Date | null): void {
    this.value.set(date);
    this.close();
  }
  private _serializeValueIntoDateInput() {
    this.dateInputValue.set(this.serializeFn()(this.value()));
  }
  private _cancelCalendarSelection(): void {
    this.close();
  }

  onAcceptButtonClick(): void {
    this._acceptSelectedDate(this._valueToAccept);
    this._valueToAccept = null;
  }
  onCancelButtonClick(): void {
    this._cancelCalendarSelection();
  }

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
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
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
  }
  private _destroyOverlay(): void {
    if (!this.dropdownOverlay) return;

    this.dropdownOverlay.dispose();
    delete this.dropdownOverlay;
  }

  //! hooks
  ngAfterViewInit(): void {
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
  onCalendarButtonClick(event: MouseEvent): void {
    if (this.calendarDisabled()) return;
    if (this.calendarHidden()) return;
    event.preventDefault();
    event.stopPropagation();

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
  readonly valueTemplate = contentChild(ArdDateInputValueTemplateDirective);
  readonly calendarIconTemplate = contentChild(ArdDateInputCalendarIconTemplateDirective);
  readonly acceptButtonsTemplate = contentChild(ArdDateInputAcceptButtonsTemplateDirective);

  readonly prefixTemplate = contentChild(ArdDateInputPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdDateInputSuffixTemplateDirective);

  readonly calendarDaysViewHeaderTemplate = contentChild(ArdDateInputDaysViewHeaderTemplateDirective);
  readonly calendarYearsViewHeaderTemplate = contentChild(ArdDateInputYearsViewHeaderTemplateDirective);
  readonly calendarMonthsViewHeaderTemplate = contentChild(ArdDateInputMonthsViewHeaderTemplateDirective);
  readonly calendarWeekdayTemplate = contentChild(ArdDateInputWeekdayTemplateDirective);
  readonly calendarFloatingMonthTemplate = contentChild(ArdDateInputFloatingMonthTemplateDirective);
  readonly calendarYearTemplate = contentChild(ArdDateInputYearTemplateDirective);
  readonly calendarMonthTemplate = contentChild(ArdDateInputMonthTemplateDirective);
  readonly calendarDayTemplate = contentChild(ArdDateInputDayTemplateDirective);

  //! context providers
  readonly valueContext = computed<ArdDateInputValueContext>(() => ({
    $implicit: this.value(),
  }));

  readonly acceptButtonsContext = computed<ArdDateInputAcceptButtonsContext>(() => ({
    $implicit: () => this.onAcceptButtonClick(),
    accept: () => this.onAcceptButtonClick(),
    cancel: () => this.onCancelButtonClick(),
    disabled: this.disabled() || this.calendarDisabled(),
  }));
}
